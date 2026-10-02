// Gera o manifest.json a partir do config.json.
// Uso: node build.js
const fs = require("fs");
const path = require("path");

const root = __dirname;
const config = JSON.parse(fs.readFileSync(path.join(root, "config.json"), "utf8"));

for (const key of ["name", "version", "site"]) {
  if (!config[key]) throw new Error(`config.json: campo "${key}" é obrigatório`);
}
if (!/^\d+(\.\d+){0,3}$/.test(config.version)) {
  throw new Error(`config.json: "version" deve ter até 4 números separados por ponto (ex.: 2.0.1)`);
}

const origin = new URL(config.site).origin;

const manifest = {
  manifest_version: 3,
  name: config.name,
  version: config.version,
  description: config.description || "",
  ...(config.author && { author: config.author }),
  permissions: ["declarativeNetRequestWithHostAccess", "storage", "alarms", "browsingData"],
  host_permissions: [`${origin}/*`],
  background: { service_worker: "background.js" },
  action: { default_title: config.name, default_popup: "popup.html" },
};

if (config.icon) {
  if (fs.existsSync(path.join(root, config.icon))) {
    const icons = { 16: config.icon, 32: config.icon, 48: config.icon, 128: config.icon };
    manifest.icons = icons;
    manifest.action.default_icon = icons;
  } else {
    console.warn(`Aviso: ícone "${config.icon}" não encontrado, usando o ícone padrão do Chrome.`);
  }
}

fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`manifest.json gerado: ${manifest.name} v${manifest.version} → ${origin}`);
