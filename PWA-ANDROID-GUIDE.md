# Guia PWA e APK Android - MSC Consultoria

Este documento explica como instalar e usar o aplicativo MSC Consultoria como PWA (Progressive Web App) em dispositivos móveis e como gerar um APK Android para distribuição interna.

## 📱 Instalação como PWA

### Android (Chrome/Edge)

1. Acesse o site da aplicação no navegador Chrome ou Edge
2. Toque no menu (três pontos) no canto superior direito
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme a instalação
5. O ícone do app aparecerá na tela inicial do dispositivo

### iOS (Safari)

1. Acesse o site da aplicação no Safari
2. Toque no botão de compartilhar (quadrado com seta para cima)
3. Role para baixo e selecione "Adicionar à Tela de Início"
4. Edite o nome se desejar e toque em "Adicionar"
5. O ícone do app aparecerá na tela inicial do dispositivo

### Desktop (Chrome/Edge/Brave)

1. Acesse o site da aplicação
2. Clique no ícone de instalação na barra de endereços (ou menu > Instalar)
3. Confirme a instalação
4. O app será instalado como aplicativo independente

## 📦 Gerando APK Android

Para distribuir o app como APK Android para a equipe interna (sem publicar na Play Store), use o **PWABuilder**:

### Método 1: PWABuilder Online (Recomendado)

1. Acesse [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Cole a URL do seu site publicado (ex: `https://msc-consultoria.vercel.app`)
3. Clique em "Start" e aguarde a análise
4. Clique em "Package For Stores"
5. Selecione "Android" e clique em "Generate Package"
6. Configure as opções:
   - **Package ID**: `com.mscconsultoria.app`
   - **App name**: `MSC Consultoria`
   - **Launcher name**: `MSC Consultoria`
   - **Theme color**: `#5A2A8A`
   - **Background color**: `#FFFFFF`
   - **Icon**: Use o logo MSC (já configurado no manifest)
7. Clique em "Generate" e baixe o arquivo `.apk`

### Método 2: Bubblewrap CLI (Avançado)

```bash
# Instalar Bubblewrap globalmente
npm install -g @bubblewrap/cli

# Inicializar projeto
bubblewrap init --manifest=https://seu-site.com/manifest.json

# Gerar APK
bubblewrap build

# O APK será gerado em: app-release-signed.apk
```

## 🔧 Configurações do Manifest

O arquivo `manifest.json` já está configurado com:

- **Nome**: MSC Consultoria - Gerenciamento Interno
- **Nome curto**: MSC Consultoria
- **Tema**: Roxo (#5A2A8A) baseado no logo
- **Ícones**: Múltiplos tamanhos (16x16, 32x32, 180x180, 192x192, 512x512)
- **Display**: Standalone (app nativo)
- **Orientação**: Portrait (vertical)
- **Atalhos**: Dashboard, Funcionários, Projetos

## 📲 Distribuindo o APK para a Equipe

### Opção 1: Compartilhamento Direto

1. Envie o arquivo `.apk` via WhatsApp, Email ou Google Drive
2. No dispositivo Android, abra o arquivo
3. Permita instalação de fontes desconhecidas (Configurações > Segurança)
4. Instale o aplicativo

### Opção 2: Firebase App Distribution (Recomendado)

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um projeto Firebase
3. Vá para "App Distribution"
4. Faça upload do APK
5. Adicione os emails dos membros da equipe
6. Eles receberão um link para baixar o app

### Opção 3: Google Drive + Link Compartilhado

1. Faça upload do APK no Google Drive
2. Configure permissões para "Qualquer pessoa com o link"
3. Compartilhe o link com a equipe
4. Membros baixam e instalam o APK

## ⚙️ Funcionalidades PWA Implementadas

✅ **Instalável**: Pode ser instalado na tela inicial  
✅ **Offline**: Funciona sem conexão (cache de recursos estáticos)  
✅ **Responsivo**: Layout adaptado para mobile e desktop  
✅ **Ícones**: Logo MSC em múltiplos tamanhos  
✅ **Splash Screen**: Tela de carregamento personalizada  
✅ **Theme Color**: Cor roxa da marca  
✅ **Service Worker**: Cache inteligente de recursos  
✅ **Atalhos**: Acesso rápido a páginas principais  

## 🔒 Segurança

- O APK gerado não precisa de assinatura da Play Store
- Ideal para distribuição interna (empresa)
- Não requer conta de desenvolvedor Google
- Atualizações podem ser feitas gerando novo APK

## 🚀 Atualizações

### Para PWA (Web)
- As atualizações são automáticas quando o site é atualizado
- O service worker detecta mudanças e atualiza o cache

### Para APK Android
- Gere um novo APK com versão incrementada
- Distribua o novo APK para a equipe
- Usuários instalam por cima da versão anterior

## 📊 Monitoramento

Para acompanhar instalações e uso:

1. Use Google Analytics com eventos customizados
2. Configure Firebase Analytics no APK
3. Monitore métricas de PWA no Chrome DevTools

## 🆘 Troubleshooting

### PWA não aparece para instalação
- Verifique se o site está em HTTPS
- Confirme que o manifest.json está acessível
- Verifique se o service worker está registrado

### APK não instala no Android
- Habilite "Fontes desconhecidas" nas configurações
- Verifique se há espaço suficiente no dispositivo
- Certifique-se de que a versão Android é compatível (mínimo 5.0)

### App não funciona offline
- Verifique se o service worker está ativo
- Confirme que os recursos estão sendo cacheados
- Teste em modo avião após primeira visita

## 📞 Suporte

Para problemas ou dúvidas sobre instalação:
- Contate o administrador do sistema
- Consulte a documentação técnica
- Verifique os logs do navegador (F12 > Console)

---

**Nota**: Este aplicativo é destinado exclusivamente para uso interno da equipe MSC Consultoria. Não distribua o APK publicamente.
