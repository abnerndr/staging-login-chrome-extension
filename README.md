# Staging Login Chrome Extension

Extensão para Chrome criada para facilitar o login em ambientes de staging, reduzindo a repetição de acessos e evitando erros ao digitar credenciais em ambientes de teste.

## O que ela faz

- Acessa rapidamente a página de login do ambiente de staging
- Permite preencher credenciais de forma prática
- Centraliza a autenticação em um único ponto da extensão
- Ajuda a testar fluxos de login sem depender de etapas manuais repetitivas

## Requisitos

- Google Chrome (ou Chromium compatível)
- Acesso ao ambiente de staging da aplicação
- Credenciais válidas do ambiente

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/staging-login-chrome-extension.git
   cd staging-login-chrome-extension
   ```

2. Abra o Chrome e acesse:

   ```text
   chrome://extensions/
   ```

3. Ative a opção "Modo do desenvolvedor".

4. Clique em "Carregar sem compactação".

5. Selecione a pasta do projeto (`staging-login-chrome-extension`).

6. A extensão será carregada e aparecerá na barra de ferramentas do navegador.

## Como usar

1. Clique no ícone da extensão: abre um popup logo abaixo dele.
2. Informe usuário e senha do staging.
3. Escolha por quanto tempo a sessão deve durar: **1 dia**, **7 dias** ou **Permanecer conectado**.
4. Clique em **Entrar**. A extensão valida as credenciais no staging antes de salvar.
5. Com a sessão ativa, use **Abrir staging** para abrir o site já autenticado.
6. Para trocar de usuário ou sair, clique em **Resetar login**. Isso apaga as credenciais e os cookies/cache do staging, e o formulário aparece de novo.

O badge no ícone mostra o estado: **ON** (verde) = autenticado, **OFF** (cinza) = não autenticado.
Quando a sessão expira, a extensão faz logout sozinha.

### Como funciona

Enquanto há sessão ativa, a extensão adiciona o header `Authorization` (HTTP Basic Auth) em toda requisição ao staging via `declarativeNetRequest`.
Como o Chrome nunca recebe um 401, ele não guarda as credenciais por conta própria, então a sessão acaba de verdade quando expira ou é resetada.

## Configuração (nome, ícone, autor, versão, site)

Edite o `config.json`:

```json
{
  "name": "Staging Auto Login",
  "description": "...",
  "version": "2.0.0",
  "author": "Seu Nome",
  "icon": "assets/icon.png",
  "site": "https://staging.mundozerokm.com.br"
}
```

Depois gere o `manifest.json` e recarregue a extensão em `chrome://extensions/`:

```bash
node build.js
```

- `version`: até 4 números separados por ponto (ex.: `2.0.1`).
- `icon`: caminho para um PNG (de preferência 128×128). Se o arquivo não existir, o Chrome usa o ícone padrão.
- `site`: origem do staging. Muda a permissão de host e o destino do login.

> Não edite o `manifest.json` à mão: ele é sobrescrito pelo `build.js`.

## Estrutura do projeto

```text
staging-login-chrome-extension/
├── config.json     # nome, versão, autor, ícone, site
├── build.js        # gera o manifest.json a partir do config.json
├── manifest.json   # gerado
├── background.js   # sessão, expiração, injeção do header, badge
├── popup.html      # dropdown da extensão
├── popup.js
└── README.md
```

## Desenvolvimento

1. Edite os arquivos da extensão (ou o `config.json` + `node build.js`).
2. Recarregue a extensão em `chrome://extensions/`.
3. Teste o fluxo de login no ambiente de staging.

## Observações importantes

- Use somente em ambientes de staging ou homologação.
- Nunca compartilhe credenciais reais ou sensíveis em repositórios públicos.
- Verifique as permissões da extensão antes de publicar ou distribuir o projeto.

## Troubleshooting

- Extensão não aparece: certifique-se de que o diretório carregado está correto.
- Login não funciona: confira o `site` no `config.json`, rode `node build.js` e recarregue a extensão.
- Erros no console: abra o console de depuração da extensão e veja mensagens de erro.

## Licença

Este projeto pode ser usado e adaptado conforme a necessidade da sua organização. Caso tenha uma licença definida no repositório, siga o arquivo correspondente.
