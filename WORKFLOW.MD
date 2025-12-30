# Workflow MSC Consultoria - Desenvolvimento → Produção

Este documento descreve o fluxo completo de trabalho da MSC Consultoria, desde o desenvolvimento de novas features até o deploy em produção.

---

## 🎯 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW MSC CONSULTORIA                      │
└─────────────────────────────────────────────────────────────────┘

  DESENVOLVIMENTO              VALIDAÇÃO              PRODUÇÃO
  (Manus)                      (Manus)                (Vercel + Supabase)
      │                            │                        │
      ▼                            ▼                        ▼
┌──────────┐                ┌──────────┐             ┌──────────┐
│ Prototipar│──────────────▶│  Testar  │────────────▶│  Deploy  │
│  Feature  │                │ com Time │             │ Produção │
└──────────┘                └──────────┘             └──────────┘
      │                            │                        │
      │                            │                        │
  Iteração                    Feedback                 Estável
   Rápida                      Validação                100% OK
```

---

## 📍 Ambientes

### 🔧 Ambiente de Desenvolvimento (Manus)

**Propósito**: Prototipagem, testes, experimentação

| Característica | Detalhes |
|---|---|
| **URL** | https://msc.manus.space |
| **Banco de Dados** | MySQL/TiDB (Manus) |
| **Autenticação** | Manus OAuth |
| **Deploy** | Automático via checkpoint |
| **Uso** | Desenvolvimento, testes, validação |
| **Dados** | Dados de teste (não persistentes) |

**Quando usar**:
- ✅ Desenvolver novas features
- ✅ Testar mudanças rapidamente
- ✅ Coletar feedback da equipe
- ✅ Experimentar sem risco
- ✅ Iterar rapidamente

### 🚀 Ambiente de Produção (Vercel + Supabase)

**Propósito**: Uso real, dados persistentes, alta disponibilidade

| Característica | Detalhes |
|---|---|
| **URL** | https://msc-consultoria-manus.vercel.app |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **Autenticação** | Supabase Auth ou Manus OAuth |
| **Deploy** | Automático via GitHub push |
| **Uso** | Uso real pela equipe MSC |
| **Dados** | Dados de produção (persistentes) |

**Quando usar**:
- ✅ Features maduras e validadas
- ✅ Uso diário pela equipe
- ✅ Dados reais e importantes
- ✅ Alta disponibilidade necessária
- ✅ Escalabilidade automática

---

## 🔄 Fluxo de Trabalho Completo

### Fase 1: Desenvolvimento (Manus)

#### 1.1 Criar Nova Feature

```bash
# Opcional: Trabalhar localmente
git checkout -b feature/nome-da-feature

# Ou trabalhar direto no Manus (recomendado)
# Descreva a feature no chat do Manus
```

#### 1.2 Implementar

- Desenvolva a feature no ambiente Manus
- Visualize mudanças em tempo real no Preview
- Teste funcionalidades básicas
- Itere rapidamente conforme necessário

#### 1.3 Testar Localmente (Manus)

1. Acesse https://msc.manus.space
2. Faça login com sua conta Manus
3. Teste a feature implementada
4. Verifique:
   - ✅ Funcionalidade básica
   - ✅ UI/UX
   - ✅ Responsividade
   - ✅ Sem erros no console

#### 1.4 Salvar Checkpoint

```
1. Acesse Management UI no Manus
2. Clique em "Save Checkpoint"
3. Adicione descrição clara:
   "feat: implementa cadastro de funcionários"
4. Clique em "Publish"
```

---

### Fase 2: Validação (Manus)

#### 2.1 Compartilhar com Equipe

```
1. Compartilhe a URL: https://msc.manus.space
2. Peça para equipe testar a feature
3. Colete feedback via:
   - Slack
   - GitHub Issues
   - Reuniões
```

#### 2.2 Iterar Conforme Feedback

```
Feedback recebido
    ↓
Fazer ajustes no Manus
    ↓
Salvar novo checkpoint
    ↓
Compartilhar novamente
    ↓
Repetir até aprovação
```

#### 2.3 Checklist de Validação

Antes de aprovar para produção, verifique:

- [ ] Feature funciona 100% conforme esperado
- [ ] UI/UX aprovada pela equipe
- [ ] Testada em desktop e mobile
- [ ] Sem bugs conhecidos
- [ ] Performance aceitável
- [ ] Acessibilidade básica OK
- [ ] Documentação atualizada (se necessário)

---

### Fase 3: Preparação para Produção

#### 3.1 Sincronizar com GitHub

Se desenvolveu no Manus:

```bash
# O Manus já sincroniza automaticamente
# Apenas certifique-se de que o último checkpoint foi salvo
```

Se desenvolveu localmente:

```bash
git add .
git commit -m "feat: nova funcionalidade validada"
git push origin feature/nome-da-feature
```

#### 3.2 Merge para Main

```bash
# Via GitHub Pull Request (recomendado)
1. Abra PR no GitHub
2. Peça review de outro dev
3. Merge para main após aprovação

# Ou via linha de comando
git checkout main
git merge feature/nome-da-feature
git push origin main
```

#### 3.3 Verificar Migrações de Banco

Se a feature incluir mudanças no banco:

**No Manus (MySQL)**:
```bash
pnpm db:push
```

**Para Produção (PostgreSQL/Supabase)**:

1. Adapte o schema para PostgreSQL (veja Deploy-Vercel.MD)
2. Teste as migrações localmente
3. Crie backup no Supabase
4. Execute migrações via SQL Editor

---

### Fase 4: Deploy em Produção (Vercel)

#### 4.1 Deploy Automático

Quando você faz push para `main`, a Vercel detecta automaticamente e inicia o deploy:

```
git push origin main
    ↓
Vercel detecta push
    ↓
Inicia build automático
    ↓
Executa testes (se configurados)
    ↓
Deploy em produção
    ↓
URL atualizada: https://msc-consultoria-manus.vercel.app
```

#### 4.2 Monitorar Deploy

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Deployments**
3. Acompanhe o build em tempo real
4. Verifique logs se houver erro

#### 4.3 Validar em Produção

Após deploy bem-sucedido:

1. Acesse https://msc-consultoria-manus.vercel.app
2. Teste a feature em produção
3. Verifique:
   - ✅ Feature funcionando
   - ✅ Sem erros no console
   - ✅ Performance OK
   - ✅ Dados sendo salvos corretamente

---

### Fase 5: Monitoramento Pós-Deploy

#### 5.1 Primeiras 24h

Monitore ativamente:

- **Vercel Logs**: Erros ou warnings
- **Supabase Monitoring**: Performance de queries
- **Feedback da Equipe**: Bugs ou problemas

#### 5.2 Se Algo Der Errado

**Rollback Rápido**:

```
1. Acesse Vercel Deployments
2. Encontre deployment anterior estável
3. Clique em "Promote to Production"
4. Produção volta ao estado anterior em ~30s
```

**Rollback de Banco** (se necessário):

```
1. Acesse Supabase → Database → Backups
2. Selecione backup anterior
3. Clique em "Restore"
```

---

## 📊 Comparação de Ambientes

| Aspecto | Manus (Dev) | Vercel + Supabase (Prod) |
|---------|-------------|--------------------------|
| **Velocidade de Deploy** | Instantâneo | ~2-3 minutos |
| **Custo** | Incluído no Manus | Free tier disponível |
| **Banco de Dados** | MySQL/TiDB | PostgreSQL |
| **Autenticação** | Manus OAuth | Supabase Auth ou Manus |
| **Escalabilidade** | Limitada | Automática |
| **Dados** | Temporários | Persistentes |
| **Uso** | Desenvolvimento | Produção |
| **Rollback** | Via checkpoints | Via deployments |

---

## 🎯 Boas Práticas

### ✅ DO (Faça)

- ✅ Sempre teste no Manus antes de produção
- ✅ Colete feedback da equipe antes de deploy
- ✅ Crie backups antes de migrações de banco
- ✅ Use mensagens de commit descritivas
- ✅ Monitore logs após deploy
- ✅ Documente mudanças importantes
- ✅ Mantenha ambientes sincronizados

### ❌ DON'T (Não Faça)

- ❌ Nunca faça deploy direto em produção sem testar
- ❌ Nunca execute migrações sem backup
- ❌ Nunca commite `.env` ou secrets
- ❌ Nunca ignore erros no console
- ❌ Nunca faça mudanças diretas no banco de produção
- ❌ Nunca pule a fase de validação
- ❌ Nunca deixe features pela metade em main

---

## 🚨 Situações Especiais

### Hotfix Urgente

Se precisar corrigir bug crítico em produção:

```bash
# 1. Crie branch de hotfix
git checkout main
git checkout -b hotfix/bug-critico

# 2. Corrija o bug
# ... fazer correção ...

# 3. Teste rapidamente no Manus
git push origin hotfix/bug-critico
# Teste em https://msc.manus.space

# 4. Merge direto para main
git checkout main
git merge hotfix/bug-critico
git push origin main

# 5. Deploy automático na Vercel
# Monitore ativamente
```

### Mudança Breaking

Se a mudança quebrar compatibilidade:

1. **Planeje migração**:
   - Documente o que vai mudar
   - Notifique a equipe com antecedência
   - Prepare scripts de migração de dados

2. **Execute em horário de baixo uso**:
   - Preferencialmente fora do horário comercial
   - Tenha equipe disponível para suporte

3. **Monitore intensivamente**:
   - Fique atento aos logs
   - Responda rapidamente a problemas

---

## 📅 Cadência Recomendada

### Desenvolvimento Contínuo

- **Diariamente**: Desenvolver e testar no Manus
- **Semanalmente**: Deploy de features validadas em produção
- **Mensalmente**: Review de performance e otimizações

### Manutenção

- **Semanalmente**: Verificar logs e monitoramento
- **Mensalmente**: Atualizar dependências
- **Trimestralmente**: Backup completo e disaster recovery test

---

## 📚 Documentos Relacionados

- **Deploy-Manus.MD**: Guia completo do ambiente de desenvolvimento
- **Deploy-Vercel.MD**: Guia completo do ambiente de produção
- **README.MD**: Visão geral do projeto
- **PWA-ANDROID-GUIDE.MD**: Guia para gerar APK Android

---

## 🎓 Treinamento da Equipe

### Para Novos Desenvolvedores

1. Leia este documento completo
2. Configure acesso ao Manus
3. Configure acesso ao GitHub
4. Faça uma feature simples de teste no Manus
5. Acompanhe um deploy em produção

### Para Gerentes de Projeto

1. Entenda o fluxo: Manus → Validação → Produção
2. Aprenda a acessar ambos ambientes
3. Saiba como solicitar features
4. Entenda quando usar cada ambiente

---

## ✅ Checklist Rápido

### Antes de Começar Feature

- [ ] Feature bem definida
- [ ] Requisitos claros
- [ ] Branch criada (se aplicável)

### Durante Desenvolvimento

- [ ] Testando no Manus
- [ ] Iterando rapidamente
- [ ] Salvando checkpoints

### Antes de Produção

- [ ] Feature 100% funcional no Manus
- [ ] Feedback da equipe coletado
- [ ] Checklist de validação completo
- [ ] Migrações de banco testadas
- [ ] Backup criado (se necessário)

### Após Deploy

- [ ] Feature validada em produção
- [ ] Logs monitorados
- [ ] Equipe notificada
- [ ] Documentação atualizada

---

**Última atualização**: Dezembro 2025  
**Versão**: 1.0  
**Mantido por**: Equipe MSC Consultoria
