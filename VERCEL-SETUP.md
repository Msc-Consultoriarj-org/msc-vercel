# Configuração do Deploy na Vercel

Este guia explica como configurar as variáveis de ambiente na Vercel para o projeto MSC Consultoria funcionar em produção com Supabase.

## ✅ Pré-requisitos Concluídos

- [x] Projeto criado no Supabase
- [x] Tabelas criadas no banco PostgreSQL
- [x] Repositório GitHub conectado

## 📋 Passo 1: Configurar Variáveis de Ambiente na Vercel

Acesse o painel da Vercel: https://vercel.com/dashboard

1. Selecione o projeto **msc-consultoria-manus**
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

### Banco de Dados (Supabase PostgreSQL)

```
DATABASE_URL=postgresql://postgres:Msc-Consultoria-supabase@db.rphisaetwcqosukcmsfi.supabase.co:5432/postgres
```

### Supabase API Keys

```
NEXT_PUBLIC_SUPABASE_URL=https://rphisaetwcqosukcmsfi.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlzYWV0d2Nxb3N1a2Ntc2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMzE2NTAsImV4cCI6MjA4MjcwNzY1MH0.70GWdn4KruF6amiJ8tQ6AiFZ4x3dflgWnUwn2v7H5JI

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlzYWV0d2Nxb3N1a2Ntc2ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzEzMTY1MCwiZXhwIjoyMDgyNzA3NjUwfQ.sN6C-GU-cq3RHRDLkE0K_5VeohZwhnb3EALutBPEuXI
```

### JWT Secret

```
JWT_SECRET=itJjdPsFWOhgoDI7sqhcOPGC4SKuC3YTsMF6Va4okcPNaM8M8GUfG7v9o+E1+C3J5oQ6OjsSABHc6VlwNIZlLA==
```

### Manus OAuth

**Como obter essas variáveis:**
1. Acesse o painel do Manus: https://msc.manus.space
2. Clique no ícone de **Configurações** (engrenagem) no canto superior direito
3. Vá em **Settings** → **Secrets**
4. Copie os valores das seguintes variáveis:

```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/app-auth
VITE_APP_ID=(copiar VITE_APP_ID do Manus)
OWNER_OPEN_ID=(copiar OWNER_OPEN_ID do Manus)
OWNER_NAME=(copiar OWNER_NAME do Manus)
```

### App Branding

```
VITE_APP_TITLE=MSC Consultoria
VITE_APP_LOGO=/msc_logo_concept_04.png
```

### Manus Built-in APIs (opcional)

```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=(copiar do Manus se necessário)
VITE_FRONTEND_FORGE_API_KEY=(copiar do Manus se necessário)
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

## 🔄 Passo 2: Redeploy

Após configurar todas as variáveis:

1. Vá em **Deployments**
2. Clique nos **três pontos** do último deployment
3. Selecione **Redeploy**
4. Aguarde o build completar

## ✅ Passo 3: Verificar

Acesse: https://msc-consultoria-manus.vercel.app

O aplicativo deve:
- Carregar a interface corretamente
- Permitir login via Manus OAuth
- Conectar ao banco PostgreSQL do Supabase
- Exibir o dashboard vazio (sem dados ainda)

## 🐛 Troubleshooting

### Erro: "Database not available"
- Verifique se `DATABASE_URL` está configurada corretamente
- Confirme que as tabelas foram criadas no Supabase

### Erro: "OAuth failed"
- Verifique se `VITE_APP_ID`, `OWNER_OPEN_ID` e `OWNER_NAME` estão corretos
- Confirme que `OAUTH_SERVER_URL` aponta para `https://api.manus.im`

### Página mostra código-fonte
- Isso indica que o build falhou
- Verifique os logs de build na Vercel
- Confirme que todas as dependências estão instaladas

## 📝 Próximos Passos

Após o deploy funcionar:

1. Testar login e autenticação
2. Adicionar dados de teste (funcionários, projetos)
3. Configurar domínio customizado (opcional)
4. Configurar CI/CD para deploys automáticos
