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

1. Clique no ícone da extensão no navegador.
2. Se houver opções de ambiente, escolha o ambiente de staging desejado.
3. Informe as credenciais do usuário de teste.
4. Clique em "Login" ou no botão equivalente da extensão.
5. A página de autenticação será aberta e a extensão fará a ação configurada.
6. Verifique se o login foi concluído com sucesso no ambiente escolhido.

## Estrutura do projeto

```text
staging-login-chrome-extension/
├── manifest.json
├── popup.html
├── popup.js
├── background.js
├── content.js
├── assets/
│   └── icon.png
└── README.md
```

> A estrutura pode variar conforme a implementação exata do projeto, mas o objetivo é manter a extensão simples, leve e fácil de carregar no Chrome.

## Desenvolvimento

Se você quiser alterar a lógica da extensão:

1. Edite os arquivos JavaScript/HTML da extensão.
2. Recarregue a extensão em `chrome://extensions/`.
3. Teste o fluxo de login no ambiente de staging.
4. Ajuste a lógica de autenticação conforme a URL e os campos do formulário do sistema.

## Observações importantes

- Use somente em ambientes de staging ou homologação.
- Nunca compartilhe credenciais reais ou sensíveis em repositórios públicos.
- Verifique as permissões da extensão antes de publicar ou distribuir o projeto.

## Troubleshooting

- Extensão não aparece: certifique-se de que o diretório carregado está correto.
- Login não funciona: verifique se a página de staging mudou e se os seletores dos formulários continuam válidos.
- Erros no console: abra o console de depuração da extensão e veja mensagens de erro.

## Licença

Este projeto pode ser usado e adaptado conforme a necessidade da sua organização. Caso tenha uma licença definida no repositório, siga o arquivo correspondente.
