const $ = (id) => document.getElementById(id);
const send = (msg) => chrome.runtime.sendMessage(msg);
let site;

const manifest = chrome.runtime.getManifest();
$("appName").textContent = manifest.name;
document.title = manifest.name;
$("footer").textContent = [`v${manifest.version}`, manifest.author].filter(Boolean).join(" · ");

function render(session) {
  const on = !!session;
  $("badge").className = `badge ${on ? "on" : "off"}`;
  $("badge").textContent = on ? "Autenticado" : "Não autenticado";
  $("loginView").hidden = on;
  $("sessionView").hidden = !on;

  if (on) {
    $("sessUser").textContent = session.user;
    $("sessExpiry").textContent = session.expiresAt
      ? `Expira em ${new Date(session.expiresAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}`
      : "Sessão permanente";
  } else {
    $("error").textContent = "";
    $("user").focus();
  }
}

$("loginView").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("loginBtn").disabled = true;
  $("loginBtn").textContent = "Validando…";
  $("error").textContent = "";

  const res = await send({ type: "login", user: $("user").value, pass: $("pass").value, duration: $("duration").value });

  $("loginBtn").disabled = false;
  $("loginBtn").textContent = "Entrar";
  if (!res?.ok) {
    $("error").textContent = res?.error || "Erro ao entrar.";
    return;
  }
  $("pass").value = "";
  render(res.session);
});

$("openBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: site });
  window.close();
});

$("resetBtn").addEventListener("click", async () => {
  $("resetBtn").disabled = true;
  await send({ type: "logout" });
  $("resetBtn").disabled = false;
  render(null);
});

send({ type: "status" }).then((res) => {
  site = res.site;
  render(res.session);
});
