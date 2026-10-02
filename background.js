// O site vem do manifest (gerado a partir do config.json pelo build.js)
const ORIGIN = new URL(chrome.runtime.getManifest().host_permissions[0].replace("/*", "")).origin;
const HOST = new URL(ORIGIN).hostname;
const SITE = `${ORIGIN}/`;
const RULE_ID = 1;
const ALARM = "session-expiry";

const DAY = 24 * 60 * 60 * 1000;
const DURATIONS = { "1d": DAY, "7d": 7 * DAY, forever: null };

const RESOURCE_TYPES = [
  "main_frame", "sub_frame", "stylesheet", "script", "image", "font",
  "object", "xmlhttprequest", "ping", "media", "websocket", "other",
];

// Basic auth com suporte a caracteres não-ASCII
const toBasic = (user, pass) =>
  "Basic " + btoa(String.fromCharCode(...new TextEncoder().encode(`${user}:${pass}`)));

async function getSession() {
  const { user, pass, expiresAt } = await chrome.storage.local.get(["user", "pass", "expiresAt"]);
  if (!user || !pass) return null;
  if (expiresAt && Date.now() >= expiresAt) {
    await logout();
    return null;
  }
  return { user, pass, expiresAt: expiresAt ?? null };
}

// Injeta o header Authorization em toda requisição ao staging enquanto houver sessão.
// Como o servidor nunca responde 401, o Chrome não guarda as credenciais no cache dele
// e a sessão realmente acaba quando a regra é removida.
async function applyRule(session) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: session
      ? [{
          id: RULE_ID,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders: [{ header: "Authorization", operation: "set", value: toBasic(session.user, session.pass) }],
          },
          condition: { requestDomains: [HOST], resourceTypes: RESOURCE_TYPES },
        }]
      : [],
  });
}

async function setBadge(on) {
  await chrome.action.setBadgeText({ text: on ? "ON" : "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: on ? "#16a34a" : "#6b7280" });
  await chrome.action.setTitle({ title: on ? "Staging: autenticado" : "Staging: não autenticado" });
}

async function sync() {
  const session = await getSession();
  await applyRule(session);
  await chrome.alarms.clear(ALARM);
  if (session?.expiresAt) chrome.alarms.create(ALARM, { when: session.expiresAt });
  await setBadge(!!session);
  return session;
}

async function login({ user, pass, duration }) {
  user = (user || "").trim();
  if (!user || !pass) return { ok: false, error: "Preencha usuário e senha." };
  if (!(duration in DURATIONS)) return { ok: false, error: "Duração inválida." };

  // Valida as credenciais antes de salvar
  let res;
  try {
    res = await fetch(SITE, { headers: { Authorization: toBasic(user, pass) }, cache: "no-store" });
  } catch {
    return { ok: false, error: "Não foi possível acessar o staging." };
  }
  if (res.status === 401 || res.status === 403) return { ok: false, error: "Usuário ou senha inválidos." };

  const ms = DURATIONS[duration];
  await chrome.storage.local.set({ user, pass, duration, expiresAt: ms ? Date.now() + ms : null });
  const session = await sync();
  return { ok: true, session: publicSession(session) };
}

async function logout() {
  await chrome.storage.local.remove(["user", "pass", "expiresAt"]);
  await applyRule(null);
  await chrome.alarms.clear(ALARM);
  // Limpa cookies/cache do staging (inclui credenciais Basic Auth que o Chrome tenha guardado)
  await chrome.browsingData.remove({ origins: [ORIGIN] }, { cookies: true, cache: true }).catch(() => {});
  await setBadge(false);
}

const publicSession = (s) => (s ? { user: s.user, expiresAt: s.expiresAt } : null);

chrome.runtime.onInstalled.addListener(sync);
chrome.runtime.onStartup.addListener(sync);
chrome.alarms.onAlarm.addListener((a) => a.name === ALARM && logout());

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  const handlers = {
    status: async () => ({ ok: true, session: publicSession(await getSession()), site: SITE }),
    login: () => login(msg),
    logout: async () => (await logout(), { ok: true }),
  };
  const handler = handlers[msg?.type];
  if (!handler) return false;
  handler().then(sendResponse, (e) => sendResponse({ ok: false, error: String(e?.message || e) }));
  return true;
});
