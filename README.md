# MSC Consultoria - Sistema de Gerenciamento Interno

Aplicativo web interno para gerenciar equipes, projetos e integrações de desenvolvimento da MSC Consultoria.

## 🚀 Funcionalidades

### Gerenciamento de Equipe
- Cadastro completo de funcionários com perfil, cargo e departamento
- Visualização de equipe com status (ativo/inativo)
- Histórico de contratação e informações de contato

### Gerenciamento de Projetos
- CRUD completo de projetos
- Status de projetos (planejamento, ativo, pausado, concluído, arquivado)
- Vinculação com repositórios GitHub
- Atribuição de membros da equipe aos projetos
- Acompanhamento de datas de início e conclusão

### Catálogo de Dependências
- Registro de tecnologias, bibliotecas e ferramentas
- Categorização (biblioteca, framework, ferramenta, serviço, plataforma)
- Documentação e guias de instalação
- Vinculação de dependências aos projetos

### Dashboard
- Visão geral com estatísticas em tempo real
- Total de funcionários ativos
- Projetos em andamento
- Tecnologias cadastradas
- Projetos recentes e membros da equipe

### Integrações (Em Desenvolvimento)
- GitHub API - Repositórios, issues e pull requests
- Slack API - Canais e mensagens
- Manus - Sincronização de tarefas

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **TailwindCSS 4** - Estilização
- **Vite** - Build tool
- **Wouter** - Roteamento
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

### Backend
- **Express 4** - Servidor HTTP
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM para MySQL
- **Manus OAuth** - Autenticação
- **Superjson** - Serialização de dados

### Banco de Dados
- **MySQL/TiDB** - Banco de dados relacional
- Tabelas: users, employees, projects, projectMembers, dependencies, projectDependencies, communicationIntegrations

### PWA e Mobile
- **Service Worker** - Cache offline
- **Web App Manifest** - Instalação como app
- **Responsivo** - Design mobile-first
- **APK Android** - Distribuição via PWABuilder

## 📦 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 22+
- pnpm 10+
- MySQL ou TiDB (configurado automaticamente via Manus)

### Instalação

```bash
# Clonar repositório
git clone https://github.com/Msc-Consultoriarj-org/msc-consultoria.git
cd msc-consultoria

# Instalar dependências
pnpm install

# Executar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

### Scripts Disponíveis

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Inicia servidor de produção
pnpm check        # Verifica tipos TypeScript
pnpm format       # Formata código com Prettier
pnpm test         # Executa testes com Vitest
pnpm db:push      # Gera e aplica migrações do banco
```

## 🗄️ Estrutura do Projeto

```
msc-consultoria/
├── client/                    # Frontend React
│   ├── public/               # Arquivos estáticos
│   │   ├── manifest.json     # PWA manifest
│   │   ├── sw.js            # Service worker
│   │   └── *.png            # Ícones do app
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── Employees.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Dependencies.tsx
│   │   │   └── Integrations.tsx
│   │   ├── lib/             # Utilitários
│   │   ├── App.tsx          # Rotas principais
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Estilos globais
│   └── index.html           # HTML template
├── server/                   # Backend Express + tRPC
│   ├── routers.ts           # tRPC routers
│   ├── db.ts                # Database helpers
│   └── _core/               # Framework core
├── drizzle/                 # Database schema
│   └── schema.ts            # Tabelas e tipos
├── shared/                  # Código compartilhado
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

### Paleta de Cores
Baseada no logo MSC Consultoria (gradiente roxo-azul):

- **Primária**: `#5A2A8A` (Roxo)
- **Secundária**: `#2E67B2` (Azul)
- **Background**: `#F8F9FA` (Cinza claro)
- **Foreground**: `#212529` (Cinza escuro)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

## 🔐 Autenticação

O sistema utiliza **Manus OAuth** para autenticação:

- Login automático via Manus
- Sessão persistente com cookies HTTP-only
- Controle de acesso baseado em roles (admin/user)
- Proteção de rotas no frontend e backend

## 📱 PWA e Mobile

O aplicativo é um PWA completo:

- ✅ Instalável na tela inicial (Android, iOS, Desktop)
- ✅ Funciona offline (cache de recursos estáticos)
- ✅ Ícones personalizados com logo MSC
- ✅ Splash screen automática
- ✅ Tema personalizado (#5A2A8A)
- ✅ Atalhos para páginas principais

### Instalação como PWA

Consulte o guia completo: [PWA-ANDROID-GUIDE.md](./PWA-ANDROID-GUIDE.md)

### Gerar APK Android

```bash
# Opção 1: PWABuilder Online (Recomendado)
# Acesse: https://www.pwabuilder.com/
# Cole a URL do site e gere o APK

# Opção 2: Bubblewrap CLI
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://seu-site.com/manifest.json
bubblewrap build
```

## 🚀 Deploy

### Vercel (Recomendado)

O projeto está configurado para deploy automático na Vercel:

1. Conecte o repositório GitHub à Vercel
2. Configure as variáveis de ambiente (fornecidas automaticamente via Manus)
3. Deploy automático a cada push na branch `main`

### Variáveis de Ambiente

As seguintes variáveis são injetadas automaticamente pelo Manus:

```env
DATABASE_URL                    # MySQL/TiDB connection string
JWT_SECRET                      # Session cookie signing
VITE_APP_ID                     # Manus OAuth app ID
OAUTH_SERVER_URL                # Manus OAuth backend
VITE_OAUTH_PORTAL_URL          # Manus login portal
OWNER_OPEN_ID                   # Owner's OpenID
OWNER_NAME                      # Owner's name
BUILT_IN_FORGE_API_URL         # Manus APIs
BUILT_IN_FORGE_API_KEY         # API key (server)
VITE_FRONTEND_FORGE_API_KEY    # API key (frontend)
VITE_FRONTEND_FORGE_API_URL    # Manus APIs (frontend)
VITE_ANALYTICS_ENDPOINT        # Analytics endpoint
VITE_ANALYTICS_WEBSITE_ID      # Analytics ID
```

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test -- --watch

# Executar testes com coverage
pnpm test -- --coverage
```

Exemplo de teste (ver `server/auth.logout.test.ts`):

```typescript
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    // Test implementation
  });
});
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **users** - Usuários autenticados (Manus OAuth)
- **employees** - Funcionários da empresa
- **projects** - Projetos da consultoria
- **projectMembers** - Membros atribuídos aos projetos
- **dependencies** - Catálogo de tecnologias
- **projectDependencies** - Dependências por projeto
- **communicationIntegrations** - Tokens OAuth de integrações

## 🔄 Workflow de Desenvolvimento

1. **Atualizar schema**: Edite `drizzle/schema.ts`
2. **Aplicar migrations**: Execute `pnpm db:push`
3. **Criar helpers**: Adicione queries em `server/db.ts`
4. **Criar procedures**: Adicione endpoints em `server/routers.ts`
5. **Consumir no frontend**: Use `trpc.*.useQuery/useMutation`
6. **Testar**: Adicione testes em `server/*.test.ts`

## 🤝 Contribuindo

Este é um projeto interno da MSC Consultoria. Para contribuir:

1. Crie uma branch a partir de `main`
2. Faça suas alterações
3. Execute testes e type checking
4. Crie um Pull Request
5. Aguarde revisão da equipe

## 📝 Licença

Propriedade da MSC Consultoria. Uso interno apenas.

## 📞 Suporte

Para dúvidas ou problemas:
- Contate o administrador do sistema
- Abra uma issue no repositório GitHub
- Consulte a documentação técnica

---

**MSC Consultoria** - Gerenciamento Interno  
Versão 1.0.0
