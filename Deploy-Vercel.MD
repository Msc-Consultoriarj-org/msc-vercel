# Deploy Vercel + Supabase - Ambiente de Produção

Este guia documenta o processo completo de deploy do **MSC Consultoria** em produção usando **Vercel** (hospedagem) e **Supabase** (banco de dados e autenticação).

---

## 🎯 Propósito do Ambiente de Produção

O ambiente de produção é utilizado para:

- **Versões estáveis** e maduras das features
- **Uso real** pela equipe MSC Consultoria
- **Alta disponibilidade** e performance
- **Dados de produção** persistentes e seguros
- **Escalabilidade** automática

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter:

- [ ] Conta na [Vercel](https://vercel.com)
- [ ] Conta no [Supabase](https://supabase.com)
- [ ] Repositório GitHub: https://github.com/Msc-Consultoriarj-org/msc-consultoria-manus
- [ ] Features testadas e validadas no ambiente Manus

---

## 🗄️ Parte 1: Configurar Supabase (Banco de Dados)

### 1.1 Criar Projeto no Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Clique em "New Project"
3. Configure:
   - **Name**: `msc-consultoria-prod`
   - **Database Password**: Gere uma senha forte (guarde!)
   - **Region**: `South America (São Paulo)` (mais próximo)
   - **Pricing Plan**: Free ou Pro (conforme necessidade)
4. Aguarde ~2 minutos para provisionamento

### 1.2 Obter Credenciais do Banco

1. No dashboard do projeto, vá em **Settings** → **Database**
2. Copie a **Connection String** (modo Pooling):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres
   ```
3. Guarde para usar nas variáveis de ambiente

### 1.3 Adaptar Schema para PostgreSQL

O projeto atual usa MySQL. Precisamos adaptar para PostgreSQL:

#### Instalar dependências PostgreSQL

```bash
cd msc-consultoria
pnpm remove mysql2
pnpm add postgres @neondatabase/serverless
```

#### Atualizar drizzle.config.ts

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql", // Mudou de mysql para postgresql
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

#### Atualizar drizzle/schema.ts

Substitua os imports e tipos MySQL por PostgreSQL:

```typescript
// Antes (MySQL)
import { mysqlTable, mysqlEnum, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

// Depois (PostgreSQL)
import { pgTable, pgEnum, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

// Exemplo de conversão de tabela
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // int().autoincrement() → serial()
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: varchar("role", { length: 20 }).default("user").notNull(), // mysqlEnum → varchar
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
```

**Nota**: Enums do MySQL devem ser convertidos para `varchar` ou `pgEnum` no PostgreSQL.

#### Atualizar server/db.ts

```typescript
import { drizzle } from "drizzle-orm/postgres-js"; // Mudou de mysql2
import postgres from "postgres";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
```

### 1.4 Executar Migrações no Supabase

```bash
# Gerar migrações para PostgreSQL
pnpm db:push

# Ou manualmente via SQL Editor no Supabase
# Copie o SQL gerado em drizzle/migrations e execute no SQL Editor
```

---

## 🔐 Parte 2: Configurar Autenticação

### Opção A: Supabase Auth (Recomendado para Produção)

#### 2.1 Habilitar Providers no Supabase

1. Vá em **Authentication** → **Providers**
2. Habilite:
   - **Email** (para login com email/senha)
   - **Google** (opcional, para OAuth)
   - **GitHub** (opcional, para OAuth)

#### 2.2 Configurar Redirect URLs

Em **Authentication** → **URL Configuration**:

```
Site URL: https://msc-consultoria-manus.vercel.app
Redirect URLs:
  - https://msc-consultoria-manus.vercel.app/auth/callback
  - http://localhost:3000/auth/callback (para desenvolvimento local)
```

#### 2.3 Obter Credenciais

Em **Settings** → **API**:

```
Project URL: https://[PROJECT-REF].supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (mantenha secreto!)
```

#### 2.4 Adaptar Código para Supabase Auth

Instale o cliente Supabase:

```bash
pnpm add @supabase/supabase-js
```

Crie `server/_core/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Opção B: Manter Manus OAuth (Mais Simples)

Se preferir manter a autenticação Manus (mais simples, mas menos flexível):

- Mantenha as variáveis de ambiente Manus OAuth
- A autenticação continuará funcionando igual
- Usuários precisarão de conta Manus para acessar

---

## 🚀 Parte 3: Deploy na Vercel

### 3.1 Preparar Projeto para Vercel

O projeto precisa ser adaptado para arquitetura serverless da Vercel.

#### Estrutura de Arquivos

```
msc-consultoria/
├── api/
│   └── index.js          # Serverless function handler
├── client/               # Frontend React
├── server/               # Backend tRPC
├── vercel.json           # Configuração Vercel (já criado)
└── package.json
```

#### Atualizar package.json

Adicione scripts de build para Vercel:

```json
{
  "scripts": {
    "build": "vite build && pnpm build:server",
    "build:server": "esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

### 3.2 Importar Projeto na Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "Add New" → "Project"
3. Importe o repositório GitHub:
   ```
   Msc-Consultoriarj-org/msc-consultoria-manus
   ```
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `pnpm install`

### 3.3 Configurar Variáveis de Ambiente

Em **Settings** → **Environment Variables**, adicione:

#### Banco de Dados (Supabase)

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres
```

#### Autenticação (Supabase)

```env
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

#### Ou Manus OAuth (se preferir manter)

```env
JWT_SECRET=[gere-uma-chave-secreta]
VITE_APP_ID=[seu-app-id-manus]
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/app-auth
OWNER_OPEN_ID=[seu-open-id]
OWNER_NAME=[seu-nome]
```

#### Outras Variáveis

```env
NODE_ENV=production
VITE_APP_TITLE=MSC Consultoria
VITE_APP_LOGO=/msc_logo_concept_04.png
```

### 3.4 Deploy

1. Clique em "Deploy"
2. Aguarde o build (~2-3 minutos)
3. Acesse a URL gerada: `https://msc-consultoria-manus.vercel.app`

---

## 🔄 Parte 4: Workflow de Produção

### 4.1 Fluxo Completo: Desenvolvimento → Produção

```
1. [Manus] Desenvolver e testar feature
   ↓
2. [Manus] Validar com equipe
   ↓
3. [Manus] Criar checkpoint final
   ↓
4. [GitHub] Push para branch main
   ↓
5. [Vercel] Deploy automático em produção
   ↓
6. [Produção] Feature disponível para uso real
```

### 4.2 Estratégia de Branches

Recomendação para gerenciar ambientes:

```
main (produção)
  ↑
  └── develop (staging/manus)
       ↑
       └── feature/* (features individuais)
```

#### Workflow Git

```bash
# Desenvolver feature no Manus
git checkout -b feature/nova-funcionalidade
# ... desenvolver ...
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade

# Merge para develop (Manus)
git checkout develop
git merge feature/nova-funcionalidade
git push origin develop

# Testar no Manus
# Quando estável, merge para main (Vercel)
git checkout main
git merge develop
git push origin main
# Deploy automático na Vercel!
```

### 4.3 Migrações de Banco em Produção

**ATENÇÃO**: Migrações em produção requerem cuidado!

#### Processo Seguro

1. **Testar no Manus** primeiro:
   ```bash
   pnpm db:push
   ```

2. **Backup do Supabase**:
   - Acesse **Database** → **Backups**
   - Crie um backup manual antes da migração

3. **Executar migração**:
   - Via SQL Editor no Supabase (recomendado)
   - Ou via `pnpm db:push` com DATABASE_URL de produção (cuidado!)

4. **Validar**:
   - Verifique se as tabelas foram criadas/atualizadas
   - Teste a aplicação em produção

---

## 📊 Parte 5: Monitoramento e Logs

### 5.1 Vercel Analytics

1. Acesse **Analytics** no dashboard da Vercel
2. Visualize:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### 5.2 Vercel Logs

1. Acesse **Deployments** → Selecione um deployment
2. Clique em **Functions** para ver logs serverless
3. Filtre por erros ou warnings

### 5.3 Supabase Monitoring

1. Acesse **Database** → **Reports**
2. Monitore:
   - Query performance
   - Conexões ativas
   - Uso de storage

---

## 🔒 Parte 6: Segurança

### 6.1 Row Level Security (RLS) no Supabase

Habilite RLS para proteger dados:

```sql
-- Exemplo: Apenas admins podem deletar funcionários
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can delete employees"
ON employees
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### 6.2 Variáveis de Ambiente Sensíveis

- **NUNCA** commite `.env` no Git
- Use Vercel Environment Variables
- Rotacione secrets periodicamente

### 6.3 CORS e CSP

Configure headers de segurança no `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 🌐 Parte 7: Domínio Customizado

### 7.1 Adicionar Domínio na Vercel

1. Acesse **Settings** → **Domains**
2. Adicione seu domínio: `mscconsultoria.com.br`
3. Configure DNS:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

ou

```
Type: A
Name: @
Value: 76.76.21.21
```

4. Aguarde propagação DNS (~24h)

### 7.2 SSL Automático

A Vercel provisiona SSL automaticamente via Let's Encrypt. Nenhuma configuração adicional necessária.

---

## 🐛 Troubleshooting

### Erro: "Function Timeout"

**Causa**: Função serverless excedeu 30s (limite Vercel Free)

**Solução**:
- Otimize queries do banco
- Use caching
- Upgrade para Vercel Pro (60s timeout)

### Erro: "Database Connection Failed"

**Causa**: Credenciais incorretas ou IP bloqueado

**Solução**:
1. Verifique `DATABASE_URL` nas env vars
2. No Supabase, vá em **Settings** → **Database** → **Connection Pooling**
3. Use a connection string com pooling (porta 6543)

### Erro: "Build Failed"

**Causa**: Dependências faltando ou erro de TypeScript

**Solução**:
1. Verifique logs de build na Vercel
2. Rode `pnpm build` localmente para reproduzir
3. Corrija erros de TypeScript

### Deploy Não Atualiza

**Causa**: Cache da Vercel

**Solução**:
1. Force redeploy: **Deployments** → **...** → **Redeploy**
2. Ou limpe cache: **Settings** → **General** → **Clear Cache**

---

## 📚 Recursos Adicionais

- **Documentação Vercel**: https://vercel.com/docs
- **Documentação Supabase**: https://supabase.com/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **tRPC**: https://trpc.io

---

## ✅ Checklist de Deploy em Produção

Antes de fazer deploy em produção:

- [ ] Todas as features testadas no Manus
- [ ] Migrações de banco testadas
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Backup do banco de dados criado
- [ ] RLS habilitado no Supabase (se aplicável)
- [ ] Domínio customizado configurado (opcional)
- [ ] Monitoramento configurado
- [ ] Documentação atualizada
- [ ] Equipe notificada sobre deploy
- [ ] Plano de rollback preparado

---

## 🔄 Rollback

Se algo der errado em produção:

### Rollback Rápido (Vercel)

1. Acesse **Deployments**
2. Encontre o deployment anterior estável
3. Clique em **...** → **Promote to Production**

### Rollback de Banco (Supabase)

1. Acesse **Database** → **Backups**
2. Selecione o backup anterior
3. Clique em **Restore**

---

**Ambiente**: Produção  
**Stack**: React 19 + tRPC + PostgreSQL (Supabase) + Vercel  
**URL**: https://msc-consultoria-manus.vercel.app  
**Status**: Features maduras e validadas no Manus
