# Painel CEO

Frontend separado para administrar os estabelecimentos clientes da plataforma.

## Configuração

Copie `.env.example` para `.env.local` e configure:

- `BACKEND_URL`: endereço interno/público do `BackendC` usado pelo proxy do servidor;
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
4. Gere **Ativar aplicativo** e informe o link individual do estabelecimento e o código temporário no FrontendC daquele computador.
5. Gere o **Token impressão** e informe o estabelecimento e o token no ControlaÊ Agent daquele cliente.
6. Altere a situação para **Ativo**. O backend impede a ativação enquanto o banco e o Dono não estiverem prontos.

Cada token de impressão pertence a um único estabelecimento e só é exibido no momento da geração.

## Remoção de um estabelecimento

A opção **Remover estabelecimento** fica na edição do cliente e exige a senha do administrador do painel e a frase `EXCLUIR <link>`. A remoção suspende o acesso, destrói o schema operacional do banco PostgreSQL, apaga os uploads identificados pelo link e, somente depois, remove o cadastro e a assinatura do plano de controle. A operação não possui recuperação automática. O histórico administrativo mantém apenas um registro da exclusão com o nome e o link removidos.
