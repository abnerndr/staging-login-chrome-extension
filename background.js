const SITE = "https://staging.mundozerokm.com.br/";
const tried = new Set(); // evita loop infinito se a senha estiver errada

chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    if (details.isProxy || tried.has(details.requestId)) {
      callback({}); // deixa o Chrome mostrar o prompt normal
      return;
    }
    tried.add(details.requestId);
    chrome.storage.local.get(["user", "pass"], ({ user, pass }) => {
      if (!user || !pass) {
        callback({});
        return;
      }
      callback({ authCredentials: { username: user, password: pass } });
    });
  },
  { urls: [SITE + "*"] },
  ["asyncBlocking"]
);

const cleanup = (d) => tried.delete(d.requestId);
chrome.webRequest.onCompleted.addListener(cleanup, { urls: [SITE + "*"] });
chrome.webRequest.onErrorOccurred.addListener(cleanup, { urls: [SITE + "*"] });

// Clicar no ícone da extensão abre o site (ou as opções, se ainda não configurou)
chrome.action.onClicked.addListener(async () => {
  const { user, pass } = await chrome.storage.local.get(["user", "pass"]);
  if (!user || !pass) chrome.runtime.openOptionsPage();
  else chrome.tabs.create({ url: SITE });
});
