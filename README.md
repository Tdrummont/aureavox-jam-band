# 🎤 AureaVox Jam Band

> **Sistema de gravação colaborativa em tempo real para músicos**

AureaVox é uma plataforma web que permite a músicos gravarem suas partes musicalmente de forma sincronizada, criando composições colaborativas mesmo estando em locais diferentes.

![AureaVox Logo](src/assets/aurea-vox.png)

## ✨ Características Principais

### 🎵 **Gravação Sincronizada**
- **Metrônomo integrado** com configuração de BPM e compasso
- **Count-in automático** para sincronização perfeita
- **Captação de áudio** otimizada com cancelamento de eco
- **Suporte a múltiplos formatos** (WebM, MP4, OGG)

### 🎛️ **Mixagem em Tempo Real**
- **Player com Web Audio API** para reprodução precisa
- **Controles de sincronização** (nudge -500ms a +500ms)
- **Mixagem profissional** (volume, mute, solo por trilha)
- **Visualização de ondas** e informações detalhadas

### 👥 **Colaboração**
- **Sistema de autenticação** completo
- **Projetos compartilhados** entre músicos
- **Perfis de usuário** com configurações personalizadas
- **Interface responsiva** para desktop e mobile

## 🚀 Tecnologias Utilizadas

### **Frontend**
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Web Audio API** para processamento de áudio
- **MediaRecorder API** para captação

### **Backend (Preparado para)**
- **Laravel** com PHP
- **FFmpeg** para processamento de áudio
- **Storage** para arquivos de áudio
- **API REST** para comunicação

## 📦 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Navegador moderno com suporte a Web Audio API

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/aureavox-jam-band.git

# Entre no diretório
cd aureavox-jam-band

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### **Configuração de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Development
VITE_APP_NAME=AureaVox Jam Band
VITE_APP_VERSION=1.0.0
```

## 🎯 Como Usar

### **1. Autenticação**
- Acesse `/login` para fazer login
- Ou `/register` para criar uma nova conta
- Sistema de autenticação com localStorage

### **2. Criar/Abrir Projeto**
- Vá para `/projetos` para ver seus projetos
- Clique em "Abrir" para acessar um projeto específico
- Ou crie um novo projeto

### **3. Gravar uma Trilha**
- **Configure o metrônomo**: BPM, compasso, count-in
- **Inicie o metrônomo** para sincronização
- **Grave sua parte** seguindo o count-in
- **Preview e envie** a trilha

### **4. Sincronizar e Mixar**
- **Ajuste o offset** se necessário (nudge)
- **Configure volume, mute, solo** por trilha
- **Toque todas as trilhas** juntas
- **Exporte o resultado** final

## 🏗️ Arquitetura do Sistema

### **Fluxo de Gravação**
```
1. Configurar Metrônomo → 2. Gravar Áudio → 3. Upload → 4. Processar → 5. Sincronizar → 6. Mixar
```

### **Componentes Principais**

#### **Hooks Personalizados**
- `useRecorder` - Captação de áudio
- `useMetronome` - Metrônomo com Web Audio API
- `useAudioPlayer` - Player e mixagem
- `useAuth` - Autenticação

#### **Serviços**
- `uploadService` - Upload e gerenciamento de trilhas
- `authService` - Autenticação e perfil

#### **Componentes**
- `RecordingPanel` - Interface de gravação
- `TracksList` - Lista e controles de trilhas
- `Project` - Página principal do projeto

## 🎵 Funcionalidades Técnicas

### **Captação de Áudio**
- **MediaDevices.getUserMedia** para acesso ao microfone
- **MediaRecorder** para gravação
- **Configurações otimizadas**: echo cancellation, noise suppression
- **Suporte a múltiplos formatos** com fallback automático

### **Sincronização**
- **Metrônomo preciso** com Web Audio API
- **Count-in configurável** (1-4 compassos)
- **Offset ajustável** por trilha (-500ms a +500ms)
- **Sincronização automática** via BPM

### **Mixagem**
- **Web Audio API** para reprodução
- **Controles de ganho** em dB
- **Mute/Solo** por trilha
- **Reprodução sincronizada** de múltiplas trilhas

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run preview      # Preview do build

# Linting
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas de lint

# Type checking
npm run type-check   # Verifica tipos TypeScript
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Layout/         # Layouts (Default, Auth)
│   ├── Recording/      # Componentes de gravação
│   ├── Tracks/         # Componentes de trilhas
│   └── ui/            # Componentes shadcn/ui
├── hooks/              # Hooks personalizados
│   ├── useRecorder.ts  # Captação de áudio
│   ├── useMetronome.ts # Metrônomo
│   └── useAudioPlayer.ts # Player
├── services/           # Serviços de API
├── contexts/           # Contextos React
├── pages/              # Páginas da aplicação
├── config/             # Configurações
└── assets/             # Recursos estáticos
```

## 🎨 Design System

### **Cores**
- **Primary**: Gradiente laranja/dourado
- **Secondary**: Tons de cinza
- **Accent**: Azul para elementos interativos

### **Componentes**
- **shadcn/ui** como base
- **Tailwind CSS** para customização
- **Ícones Lucide** para consistência visual

## 🚀 Deploy

### **Desenvolvimento**
```bash
npm run dev
# Acesse http://localhost:8081
```

### **Produção**
```bash
npm run build
# Arquivos estáticos em /dist
```

### **Deploy com Lovable**
1. Acesse [Lovable](https://lovable.dev)
2. Abra seu projeto
3. Clique em "Share" → "Publish"

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

### **Próximas Funcionalidades**
- [ ] **Waveform visual** para cada trilha
- [ ] **Editor de áudio** básico
- [ ] **Exportação** em múltiplos formatos
- [ ] **Chat em tempo real** entre colaboradores
- [ ] **Versionamento** de trilhas
- [ ] **Templates** de projeto
- [ ] **Integração** com DAWs populares

### **Melhorias Técnicas**
- [ ] **PWA** para uso offline
- [ ] **WebRTC** para colaboração em tempo real
- [ ] **Compressão** de áudio otimizada
- [ ] **Cache** inteligente de trilhas
- [ ] **Analytics** de uso

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe AureaVox
- **Design**: Interface moderna e intuitiva
- **Audio**: Especialistas em Web Audio API

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/aureavox-jam-band/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/aureavox-jam-band/wiki)
- **Email**: contato@aureavox.com

---

**AureaVox** - *Onde a música encontra a tecnologia* 🎵✨