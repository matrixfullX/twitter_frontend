# Twitter — Front-end

Aplicação React/TypeScript para a rede social Twitter, que contém o guia principal com a configuração dos dois projetos, ativação de conta pelos logs, endpoints e limitações de hospedagem gratuita.

## Requisitos

- Git
- Node.js 22 (o projeto fixa `22.23.5` em `.node-version`)
- npm (incluído no instalador do Node.js)
- Docker Desktop instalado e em execução para subir o backend local

No Windows, se `node` ou `npm` não for reconhecido, instale Node.js 22, feche e reabra o PowerShell. Se o PowerShell bloquear `npm.ps1`, use `npm.cmd` nos comandos abaixo.

## 2. Configurar e iniciar o backend

configure o `.env` na pasta `twitter-backend` e mantenha PostgreSQL, Redis e API rodando:

```powershell
cd $HOME\twitter-clone\twitter-backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
docker compose up -d --build
docker compose ps
docker compose exec redis redis-cli ping
Invoke-RestMethod http://localhost:8000/health/
```

O Redis deve responder `PONG` e a API `status : ok`. O `.env.example` configura a ativação de conta para aparecer nos logs da API, sem SMTP.

## 3. Instalar e executar o React

Em outra janela do PowerShell:

```powershell
cd $HOME\twitter-clone\twitter-frontend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Confira no `.env`:

```dotenv
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
REACT_APP_DOMAIN=127.0.0.1:8000
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GOOGLE_CALLBACK_URL=http://localhost:3000/
```

Instale as dependências travadas no `package-lock.json` e inicie o servidor:

```powershell
node -v
npm.cmd -v
npm.cmd ci
npm.cmd start
```

Acesse [http://localhost:3000](http://localhost:3000). Deixe o terminal aberto. Para desligar somente o React, pressione `Ctrl+C` nesse terminal; os containers do backend continuam rodando.

## 4. Criar e ativar uma conta

1. Cadastre-se pela interface com e-mail e senha válidos.
2. Na janela do backend, rode `docker compose logs --since 10m api`.
3. Copie dos logs o link que começa por `http://localhost:3000/auth/user/account/activation/` e abra-o no navegador. A mensagem de ativação é impressa no console do backend; não chega ao e-mail.
4. Quando a página confirmar a ativação, entre com a conta criada.

O token no link é temporário e não deve ser compartilhado. Se não localizar a mensagem, confira se o `.env` do backend contém `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`, recrie a API com `docker compose up -d --build api` e tente novamente. Os passos detalhados e o comando para reenviar a ativação estão no README do backend.

## 5. Login Google opcional

O login normal por e-mail e senha não depende do Google. Para habilitar login Google, crie um cliente OAuth do tipo Web application no Google Cloud Console e cadastre:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/`

Configure o Client ID em `REACT_APP_GOOGLE_CLIENT_ID` no `.env` deste projeto e em `GOOGLE_CLIENT_ID` no backend. Configure o Client Secret apenas no `.env` do backend. Esquema, domínio e barra final da URI têm que coincidir exatamente com o redirect configurado no Google. [Documentação OAuth do Google](https://developers.google.com/identity/protocols/oauth2/web-server).

Depois de editar variáveis `REACT_APP_*`, pare o React com `Ctrl+C` e execute `npm.cmd start` novamente. Não publique `.env` nem o Client Secret.

## Testar o build

```powershell
npm.cmd run build
```

O build pode exibir avisos de dependências antigas/ESLint do Create React App; verifique que conclui e gera a pasta `build`. Os testes automatizados, quando disponíveis, podem ser iniciados com `npm.cmd test`.

## Hospedagem gratuita

O front-end pode ser publicado como site estático gratuito. O backend tem um Blueprint Render com recursos Free, mas esse nível pode dormir, reiniciar e apagar dados do Redis; o Postgres gratuito expira após 30 dias. Arquivos enviados também não são persistentes sem um serviço de mídia externo. Revise limites e cobrança antes de confirmar criação e não faça upgrade pago se não quiser custos. No ambiente de console, ativação aparece nos logs e não é enviada por e-mail. Veja a seção de hospedagem gratuita no README do backend e os [limites oficiais do Render Free](https://render.com/docs/free).

## Licença

Este projeto usa a licença [MIT](LICENSE).
