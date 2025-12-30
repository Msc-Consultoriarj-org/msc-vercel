# Deploy Manus - Ambiente de Desenvolvimento e Prototipagem

Este guia documenta o processo de deploy e uso do **MSC Consultoria** no ambiente Manus para desenvolvimento, testes e prototipagem de novas features.

---

## 🎯 Propósito do Ambiente Manus

O ambiente Manus é utilizado para:

- **Prototipagem rápida** de novas funcionalidades
- **Testes** de features antes de ir para produção
- **Desenvolvimento iterativo** com feedback imediato
- **Validação** de conceitos e UX com a equipe
- **Ambiente seguro** para experimentação sem afetar produção

---

## 🚀 Deploy Automático

O projeto já está configurado e conectado ao GitHub. O deploy no Manus acontece automaticamente:

### URL de Produção (Manus)
```
https://msc.manus.space
```

### Processo de Deploy

1. **Commit e Push** para o repositório GitHub:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

2. **Sincronização Automática**: O Manus detecta as mudanças e sincroniza automaticamente

3. **Checkpoint**: Crie um checkpoint no Manus para salvar o estado:
   - Acesse o painel do Manus
   - Clique em "Save Checkpoint"
   - Adicione uma descrição das mudanças

4. **Publish**: Clique no botão "Publish" no header do Management UI para publicar a versão

---

## 🗄️ Banco de Dados

### Ambiente de Desenvolvimento

O Manus utiliza **MySQL/TiDB** gerenciado automaticamente pela plataforma.

#### Acesso ao Banco

1. Acesse o **Management UI** → **Database**
2. Interface CRUD completa disponível
3. Connection info no canto inferior esquerdo (lembre de habilitar SSL)

#### Variáveis de Ambiente (Auto-injetadas)

O Manus injeta automaticamente as seguintes variáveis:

```env
DATABASE_URL=mysql://...
JWT_SECRET=...
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=...
VITE_OAUTH_PORTAL_URL=...
OWNER_OPEN_ID=...
OWNER_NAME=...
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
VITE_APP_TITLE=MSC Consultoria
VITE_APP_LOGO=/msc_logo_concept_04.png
```

**Não é necessário configurar manualmente** - tudo funciona out-of-the-box.

---

## 🔄 Workflow de Desenvolvimento

### 1. Desenvolver Localmente (Opcional)

```bash
# Clone o repositório
git clone https://github.com/Msc-Consultoriarj-org/msc-consultoria.git
cd msc-consultoria

# Instale dependências
pnpm install

# Configure .env local (copie do Manus Settings → Secrets)
cp .env.example .env

# Rode o servidor de desenvolvimento
pnpm dev
```

### 2. Desenvolver no Manus (Recomendado)

- Faça alterações diretamente no chat do Manus
- Visualize mudanças em tempo real no Preview
- Teste funcionalidades imediatamente
- Salve checkpoints frequentemente

### 3. Testar Features

1. Acesse https://msc.manus.space
2. Faça login com sua conta Manus
3. Teste a funcionalidade implementada
4. Colete feedback da equipe
5. Itere rapidamente se necessário

### 4. Migrar para Produção

Quando a feature estiver madura e validada:

1. Certifique-se de que todos os testes passaram
2. Crie um checkpoint final no Manus
3. Documente as mudanças
4. Siga o guia **Deploy-Vercel.MD** para publicar em produção

---

## 🛠️ Migrações de Banco de Dados

### Criar Nova Migração

1. Edite `drizzle/schema.ts` com as mudanças necessárias

2. Execute o comando de migração:
   ```bash
   pnpm db:push
   ```

3. O comando acima:
   - Gera a migração com `drizzle-kit generate`
   - Aplica no banco com `drizzle-kit migrate`

### Exemplo: Adicionar Nova Tabela

```typescript
// drizzle/schema.ts
export const newTable = mysqlTable("new_table", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

Depois execute:
```bash
pnpm db:push
```

---

## 📱 PWA e Mobile

### Testar PWA

1. Acesse https://msc.manus.space no celular
2. No Chrome/Safari, clique em "Adicionar à tela inicial"
3. O app será instalado como PWA nativo

### Gerar APK Android (Interno)

Para distribuição interna da equipe MSC:

1. Acesse [PWABuilder](https://www.pwabuilder.com/)
2. Cole a URL: `https://msc.manus.space`
3. Clique em "Start" e aguarde a análise
4. Clique em "Package for Stores" → "Android"
5. Configure:
   - **Package ID**: `com.mscconsultoria.app`
   - **App Name**: MSC Consultoria
   - **Signing Key**: Gere uma nova ou use existente
6. Download o APK
7. Distribua para a equipe via Google Drive ou link direto

**Nota**: Este APK é apenas para uso interno, não requer publicação na Play Store.

---

## 🔐 Autenticação

O Manus utiliza **Manus OAuth** integrado:

- Login automático com conta Manus
- Controle de acesso por roles (admin/user)
- Sessão persistente entre dispositivos

### Gerenciar Permissões

Para promover um usuário a admin:

1. Acesse **Management UI** → **Database**
2. Abra a tabela `users`
3. Encontre o usuário
4. Altere o campo `role` para `admin`

---

## 📊 Monitoramento

### Analytics

O Manus fornece analytics integrado:

- Acesse **Management UI** → **Dashboard**
- Visualize UV (Unique Visitors) e PV (Page Views)
- Acompanhe uso em tempo real

### Logs

Para visualizar logs do servidor:

1. Acesse o painel do Manus
2. Vá em **Management UI** → **Code**
3. Abra o terminal integrado
4. Logs aparecem automaticamente durante desenvolvimento

---

## 🔄 Sincronização com GitHub

### Status Atual

- **Repositório**: https://github.com/Msc-Consultoriarj-org/msc-consultoria-manus
- **Branch**: main
- **Sincronização**: Bidirecional automática

### Fazer Mudanças Externas

Se você editar o código fora do Manus:

```bash
# Faça suas mudanças
git add .
git commit -m "feat: nova feature"
git push origin main
```

No Manus:
1. Vá em **Management UI** → **Settings** → **GitHub**
2. Clique em "Sync" para puxar as mudanças
3. Ou simplesmente crie um novo checkpoint (sync automático)

---

## 🎨 Customização

### Alterar Logo e Título

1. Acesse **Management UI** → **Settings** → **General**
2. Modifique:
   - **Website Name**: Nome exibido
   - **Favicon**: Upload novo ícone

Ou via variáveis de ambiente (Settings → Secrets):
```env
VITE_APP_TITLE=Novo Título
VITE_APP_LOGO=/caminho/para/logo.png
```

### Domínio Customizado

1. Acesse **Management UI** → **Settings** → **Domains**
2. Opções:
   - Modificar prefixo: `seu-prefixo.manus.space`
   - Comprar domínio: Compre diretamente no Manus
   - Vincular domínio existente: Configure DNS

---

## 🐛 Troubleshooting

### Servidor não está respondendo

1. Acesse **Management UI** → **Dashboard**
2. Verifique o status do servidor
3. Se necessário, reinicie via interface

### Erro de banco de dados

1. Verifique se as migrações foram aplicadas: `pnpm db:push`
2. Acesse o Database UI e verifique as tabelas
3. Confira os logs para mensagens de erro

### Mudanças não aparecem

1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se o checkpoint foi salvo
3. Confirme que clicou em "Publish"

---

## 📚 Recursos Adicionais

- **Documentação Manus**: https://docs.manus.im
- **Suporte**: https://help.manus.im
- **GitHub Issues**: https://github.com/Msc-Consultoriarj-org/msc-consultoria-manus/issues

---

## ✅ Checklist de Deploy

Antes de considerar uma feature pronta para produção:

- [ ] Feature implementada e funcionando no Manus
- [ ] Testes manuais realizados
- [ ] Feedback da equipe coletado
- [ ] Sem erros no console do navegador
- [ ] Sem erros nos logs do servidor
- [ ] Responsividade testada (desktop + mobile)
- [ ] PWA testado em dispositivo real
- [ ] Checkpoint criado com descrição clara
- [ ] Documentação atualizada (se necessário)
- [ ] Pronto para migrar para Vercel/Supabase (produção)

---

**Ambiente**: Desenvolvimento e Prototipagem  
**Stack**: React 19 + tRPC + MySQL/TiDB + Manus OAuth  
**URL**: https://msc.manus.space  
**Próximo passo**: Quando maduro, migrar para produção seguindo **Deploy-Vercel.MD**
