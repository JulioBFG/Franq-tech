# Finance App

Aplicação para visualização de cotações financeiras em tempo real, com autenticação de usuários e persistência de dados.

## Funcionalidades

- **Autenticação de Usuários**

- **Visualização de Cotações**

- **Gráficos de Evolução**

  - Gráfico interativo de evolução de preços
  - Tooltip com informações detalhadas
  - Atualização automática a cada 30 segundos

- **Interface Responsiva**
  - Layout adaptável para diferentes tamanhos de tela
  - Componentes interativos e feedback visual
  - Estados de carregamento, erro e vazio

## Tecnologias Utilizadas

- **React** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápida e eficiente
- **Zustand** - Gerenciamento de estado global
- **React Router** - Navegação entre páginas
- **Radix UI** - Componentes acessíveis e customizáveis
- **Recharts** - Biblioteca para criação de gráficos
- **Axios** - Cliente HTTP para requisições à API

## Como Rodar o Projeto

1. **Pré-requisitos**

   - Node.js (versão 14 ou superior)
   - npm ou yarn

2. **Instalação**

   ```bash
   # Clonar o repositório
   git clone https://github.com/seu-usuario/finance-app.git
   cd finance-app

   # Instalar dependências
   yarn install
   ```

3. **Desenvolvimento**

   ```bash
   # Iniciar servidor de desenvolvimento
   yarn dev
   ```

   O aplicativo estará disponível em: http://localhost:5173

4. **Build para Produção**

   ```bash
   # Gerar build otimizada
   yarn build
   ```

## Estrutura do Projeto

```
finance-app/
├── src/
│   ├── components/      # Componentes React
│   ├── store/           # Estado global com Zustand
│   ├── types/           # Definições de tipos TypeScript
│   ├── App.tsx          # Componente principal e rotas
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
└── ...
```

## API Utilizada

A aplicação consome dados da API HG Brasil Finance, que fornece cotações de:

- Moedas (Dólar, Euro, etc.)
- Ações e índices (Ibovespa, Nasdaq, etc.)
- Bitcoin e outras criptomoedas
