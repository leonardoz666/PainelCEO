# Painel CEO

Frontend separado para administrar os estabelecimentos clientes da plataforma.

## Configuração

Copie `.env.example` para `.env.local` e configure:

- `BACKEND_URL`: endereço interno/público do `Backendrei` usado pelo proxy do servidor;
- `NEXT_PUBLIC_OPERATIONAL_URL`: endereço do frontend operacional usado nos links dos restaurantes.

## Desenvolvimento

```powershell
npm install
npm run dev
```

O painel usa a porta `3020`. O backend precisa autorizar esse endereço em `CEO_FRONTEND_URL`.

## Primeiro acesso

Depois que a migration do plano de controle for revisada e aplicada, configure `CEO_INITIAL_NAME`, `CEO_INITIAL_EMAIL` e `CEO_INITIAL_PASSWORD` no ambiente do backend e execute:

```powershell
npm run ceo:create
```

As conexões PostgreSQL cadastradas no painel nunca são devolvidas ao navegador; ficam criptografadas pelo backend com `TENANT_DATABASE_SECRET`.

## Ativação de um estabelecimento

1. Cadastre o estabelecimento com um banco PostgreSQL vazio ou já pertencente à plataforma.
2. Use **Preparar banco**. Bancos existentes recebem um backup lógico antes das migrations.
3. Crie o acesso de **Dono**.
4. Gere o **Token impressão** e informe o link do estabelecimento e o token no ControlaÊ Printer Agent daquele cliente.
5. Altere a situação para **Ativo**. O backend impede a ativação enquanto o banco e o Dono não estiverem prontos.

Cada token de impressão pertence a um único estabelecimento e só é exibido no momento da geração.
