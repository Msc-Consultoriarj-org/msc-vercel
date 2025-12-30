# 🚀 Deploy na Vercel - Guia Simplificado

Este guia mostra como fazer o deploy do MSC Consultoria na Vercel usando Supabase Auth.

## ✅ Pré-requisitos Concluídos

- [x] Projeto criado no Supabase
- [x] Tabelas criadas no banco PostgreSQL  
- [x] Supabase Auth configurado
- [x] Código adaptado para produção

## 📋 Passo 1: Configurar Variáveis na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **msc-consultoria-manus**
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

### Banco de Dados

```
DATABASE_URL=postgresql://postgres.rphisaetwcqosukcmsfi:Msc-Consultoria-supabase@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Supabase (Autenticação + API)

```
VITE_SUPABASE_URL=https://rphisaetwcqosukcmsfi.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlzYWV0d2Nxb3N1a2Ntc2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMzE2NTAsImV4cCI6MjA4MjcwNzY1MH0.70GWdn4KruF6amiJ8tQ6AiFZ4x3dflgWnUwn2v7H5JI

NEXT_PUBLIC_SUPABASE_URL=https://rphisaetwcqosukcmsfi.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaGlzYWV0d2Nxb3N1a2Ntc2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMzE2NTAsImV4cCI6MjA4MjcwNzY1MH0.70GWdn4KruF6amiJ8tQ6AiFZ4x3dflgWnUwn2v7H5JI
```

### JWT Secret

```
JWT_SECRET=itJjdPsFWOhgoDI7sqhcOPGC4SKuC3YTsMF6Va4okcPNaM8M8GUfG7v9o+E1+C3J5oQ6OjsSABHc6VlwNIZlLA==
```

### App Branding

```
VITE_APP_TITLE=MSC Consultoria
VITE_APP_LOGO=/msc_logo_concept_04.png
```

### Ambiente

```
NODE_ENV=production
VERCEL=1
```

## 📦 Passo 2: Fazer Push para GitHub

```bash
cd /home/ubuntu/msc-consultoria

# Adicionar remote do repositório msc-vercel
git remote add vercel https://github.com/Msc-Consultoriarj-org/msc-vercel.git

# Fazer commit e push
git add .
git commit -m "feat: Configurar Supabase Auth para produção"
git push vercel main --force
```

## 🔄 Passo 3: Conectar Vercel ao Repositório

1. Na Vercel, vá em **Settings** → **Git**
2. Conecte ao repositório: `Msc-Consultoriarj-org/msc-vercel`
3. Branch: `main`
4. A Vercel fará o deploy automático

## ✅ Passo 4: Criar Primeiro Usuário

1. Acesse: https://msc-consultoria-manus.vercel.app/login
2. Clique em **"Não tem uma conta? Cadastre-se"**
3. Crie sua conta com email e senha
4. Verifique seu email (Supabase enviará link de confirmação)
5. Faça login e acesse o dashboard

## 🎯 Diferenças entre Ambientes

### Desenvolvimento (Manus)
- URL: https://msc.manus.space
- Auth: Manus OAuth (automático)
- Banco: MySQL (gerenciado pelo Manus)
- Uso: Prototipagem e desenvolvimento

### Produção (Vercel)
- URL: https://msc-consultoria-manus.vercel.app
- Auth: Supabase Auth (email/senha)
- Banco: PostgreSQL (Supabase)
- Uso: Aplicação final para equipe

## 🐛 Troubleshooting

### Erro: "Database not available"
- Verifique se `DATABASE_URL` está configurada corretamente
- Use a connection string com `pgbouncer=true` para Vercel

### Erro: "Supabase client not initialized"
- Confirme que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas
- Ambas as versões (VITE_ e NEXT_PUBLIC_) devem estar presentes

### Página de login não aparece
- Verifique se a rota `/login` está configurada no App.tsx
- Confirme que o build foi bem-sucedido na Vercel

### Email de confirmação não chega
- Verifique a caixa de spam
- No Supabase, vá em Authentication → Email Templates
- Para testes, desabilite confirmação de email em Authentication → Settings

## 📝 Próximos Passos

Após o deploy funcionar:

1. **Adicionar membros da equipe**: Cada pessoa deve criar sua conta em /login
2. **Popular dados**: Adicionar funcionários, projetos e dependências
3. **Configurar domínio customizado**: Settings → Domains na Vercel
4. **Configurar CI/CD**: Deploys automáticos a cada push no GitHub
