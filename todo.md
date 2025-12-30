# MSC Consultoria - TODO List

## Fase 1: Estrutura Base e Design System
- [x] Configurar paleta de cores baseada no logo (roxo/azul)
- [x] Configurar tipografia e espaçamentos
- [x] Criar layout com sidebar de navegação
- [x] Configurar tema e CSS variables

## Fase 2: Schema do Banco de Dados
- [x] Criar tabela de funcionários (employees)
- [x] Criar tabela de projetos (projects)
- [x] Criar tabela de membros de projetos (project_members)
- [x] Criar tabela de dependências (dependencies)
- [x] Criar tabela de dependências por projeto (project_dependencies)
- [x] Criar tabela de integrações de comunicação (communication_integrations)
- [x] Executar migrações no banco de dados

## Fase 3: Sistema de Autenticação
- [x] Implementar autenticação com Manus OAuth
- [x] Criar controle de acesso baseado em roles (admin/user)
- [x] Implementar rotas protegidas
- [x] Criar página de login
- [x] Criar componente de perfil do usuário

## Fase 4: CRUD de Funcionários e Projetos
- [x] Criar tRPC procedures para funcionários (list, create, update, delete)
- [x] Criar tRPC procedures para projetos (list, create, update, delete)
- [x] Criar página de listagem de funcionários
- [ ] Criar formulário de cadastro/edição de funcionários
- [x] Criar página de listagem de projetos
- [ ] Criar formulário de cadastro/edição de projetos
- [ ] Criar página de detalhes do projeto
- [ ] Implementar atribuição de membros aos projetos

## Fase 5: Dashboard e Catálogo de Dependências
- [x] Criar dashboard com métricas gerais
- [x] Exibir total de projetos ativos
- [x] Exibir total de funcionários
- [x] Criar catálogo de dependências
- [x] Criar tRPC procedures para dependências
- [x] Criar página de listagem de dependências
- [ ] Criar formulário de cadastro/edição de dependências
- [ ] Vincular dependências aos projetos

## Fase 6: Integrações Externas
- [ ] Configurar integração com GitHub API
- [ ] Criar tRPC procedures para GitHub (repos, issues, PRs)
- [ ] Exibir repositórios vinculados aos projetos
- [ ] Exibir atividades recentes do GitHub no dashboard
- [ ] Configurar integração com Slack API
- [ ] Criar tRPC procedures para Slack (canais, mensagens)
- [ ] Exibir mensagens recentes do Slack no dashboard
- [x] Criar página de gerenciamento de integrações

## Fase 7: Testes e Deploy
- [ ] Criar testes unitários para procedures críticas
- [ ] Testar fluxo de autenticação
- [ ] Testar CRUD de funcionários
- [ ] Testar CRUD de projetos
- [ ] Configurar variáveis de ambiente para Vercel
- [ ] Criar arquivo vercel.json
- [ ] Configurar integração com repositório GitHub
- [ ] Documentar processo de deploy

## Fase 8: Documentação Final
- [ ] Criar README.md com instruções de instalação
- [ ] Documentar variáveis de ambiente necessárias
- [ ] Documentar estrutura do projeto
- [ ] Criar guia de uso da aplicação
- [ ] Salvar checkpoint final

## Fase 9: PWA e Mobile (Android APK)
- [x] Criar manifest.json para PWA
- [x] Adicionar ícones do app em múltiplos tamanhos
- [x] Configurar service worker para funcionamento offline
- [x] Adicionar meta tags para mobile e PWA
- [x] Configurar splash screen para instalação
- [ ] Testar instalação como PWA no mobile
- [x] Criar documentação para gerar APK com PWABuilder
- [x] Otimizar layout para telas mobile
- [ ] Adicionar suporte a gestos touch
- [ ] Testar responsividade em diferentes tamanhos de tela


## Fase 10: Dual Deployment (Manus + Vercel/Supabase)
- [x] Criar arquitetura serverless para Vercel
- [x] Configurar variáveis de ambiente para Vercel
- [x] Integrar Supabase Auth para produção
- [x] Migrar banco de dados para Supabase (PostgreSQL)
- [x] Criar vercel.json com configurações de rotas
- [x] Adaptar tRPC para funcionar em ambiente serverless
- [x] Criar Deploy-Manus.MD com guia completo
- [x] Criar Deploy-Vercel.MD com guia completo
- [x] Documentar workflow de desenvolvimento → produção
- [ ] Testar deploy em ambos os ambientes


## Fase 11: Correção Deploy Vercel + Supabase
- [x] Adaptar schema de MySQL para PostgreSQL (drizzle/schema-postgres.ts)
- [x] Criar arquivo de migração SQL para Supabase
- [x] Executar migração SQL no Supabase (tabelas criadas)
- [x] Configurar drizzle.config.postgres.ts para PostgreSQL
- [x] Instalar driver PostgreSQL (postgres)
- [x] Criar VERCEL-SETUP.md com guia completo
- [ ] Copiar variáveis do Manus para Vercel
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Fazer push para GitHub e testar deploy
- [ ] Validar aplicação funcionando na Vercel


## Fase 12: Deploy Vercel + GitHub (Supabase Auth)
- [x] Configurar Supabase Auth (email/password) para produção
- [x] Criar cliente Supabase (server/_core/supabase.ts)
- [x] Criar hook useSupabaseAuth para frontend
- [x] Criar página de login customizada (/login)
- [x] Adicionar rota de login no App.tsx
- [x] Criar DEPLOY-VERCEL-SIMPLES.md com guia completo
- [x] Criar VARIAVEIS-VERCEL.txt com todas as env vars
- [x] Fazer commit das alterações
- [x] Criar repositório msc-vercel no GitHub
- [x] Fazer push para https://github.com/Msc-Consultoriarj-org/msc-vercel
- [ ] Conectar repositório na Vercel
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Aguardar build automático e testar deploy
- [ ] Criar primeiro usuário em /login
- [ ] Validar login, banco de dados e funcionalidades em produção
