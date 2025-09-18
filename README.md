# Sistema de Pedidos de Oração

Um sistema web moderno e intuitivo para gerenciar pedidos de oração em grupos religiosos, desenvolvido com React e tecnologias modernas.

## 🙏 Funcionalidades Principais

### Gerenciamento de Pedidos
- **Criação de Pedidos**: Formulário completo para submeter novos pedidos de oração
- **Edição de Pedidos**: Possibilidade de editar pedidos existentes
- **Exclusão de Pedidos**: Remoção de pedidos quando necessário
- **Informações Completas**: Título, descrição, nome do solicitante, contato (celular e email)

### Sistema de Status
- **Pendente**: Pedido aguardando revisão
- **Em Oração**: Pedido ativo sendo orado pelo grupo
- **Respondido**: Pedido atendido ou com resposta significativa
- **Arquivado**: Pedido concluído ou não mais relevante

### Funcionalidades Avançadas
- **Dashboard com Estatísticas**: Visão geral dos pedidos por status
- **Sistema de Busca**: Busca por título, descrição ou nome do solicitante
- **Filtros por Status**: Visualização filtrada por status específico
- **Sistema de Comentários**: Adição de comentários e testemunhos
- **Notificações**: Alertas sobre ações realizadas no sistema
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

## 🚀 Tecnologias Utilizadas

- **React 18**: Framework JavaScript moderno
- **Vite**: Build tool rápido e eficiente
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes UI modernos e acessíveis
- **Lucide React**: Ícones elegantes e consistentes
- **JavaScript (JSX)**: Linguagem de programação

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- pnpm (gerenciador de pacotes)

### Passos para Execução

1. **Clone ou acesse o diretório do projeto**:
   ```bash
   cd sistema-pedidos-oracao
   ```

2. **Instale as dependências** (já instaladas):
   ```bash
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**:
   ```bash
   pnpm run dev --host
   ```

4. **Acesse a aplicação**:
   - Abra o navegador em `http://localhost:5173`
   - Para acesso em rede local: `http://[seu-ip]:5173`

## 🎯 Como Usar

### 1. Criando um Novo Pedido
1. Clique no botão "Novo Pedido de Oração"
2. Preencha o formulário com:
   - Título/Assunto do pedido
   - Descrição detalhada
   - Nome do solicitante
   - Contato (celular e email - opcionais)
3. Clique em "Submeter Pedido"

### 2. Gerenciando Status
- Cada pedido possui um dropdown para atualizar o status
- Os status disponíveis são: Pendente, Em Oração, Respondido, Arquivado
- As mudanças são salvas automaticamente

### 3. Adicionando Comentários
1. Clique no ícone de comentário (💬) no pedido desejado
2. Digite seu comentário ou testemunho
3. Clique em "Enviar Comentário"

### 4. Buscando Pedidos
- Use o campo de busca para encontrar pedidos específicos
- A busca funciona por título, descrição ou nome do solicitante
- Combine com filtros de status para resultados mais precisos

### 5. Visualizando Estatísticas
- O dashboard superior mostra contadores por status
- Acompanhe facilmente quantos pedidos estão em cada categoria

## 🎨 Interface e Design

### Características Visuais
- **Design Moderno**: Interface limpa e profissional
- **Cores Intuitivas**: Sistema de cores que facilita a identificação de status
- **Ícones Significativos**: Ícones que representam claramente cada ação
- **Responsividade**: Adapta-se perfeitamente a diferentes tamanhos de tela

### Elementos de UX
- **Feedback Visual**: Notificações para todas as ações importantes
- **Tooltips**: Dicas explicativas nos botões de ação
- **Animações Suaves**: Transições que melhoram a experiência
- **Acessibilidade**: Componentes acessíveis e semânticos

## 📊 Estrutura de Dados

### Pedido de Oração
```javascript
{
  id: number,
  titulo: string,
  descricao: string,
  nome: string,
  celular: string (opcional),
  email: string (opcional),
  status: 'Pendente' | 'Em Oração' | 'Respondido' | 'Arquivado',
  dataSubmissao: Date,
  dataUltimaAtualizacao: Date,
  comentarios: Array<Comentario>
}
```

### Comentário
```javascript
{
  id: number,
  autor: string,
  conteudo: string,
  data: Date
}
```

## 🔧 Personalização

### Modificando Status
Para adicionar ou modificar os status disponíveis, edite a variável `statusOptions` no arquivo `src/App.jsx`:

```javascript
const statusOptions = ['Pendente', 'Em Oração', 'Respondido', 'Arquivado']
```

### Alterando Cores dos Status
Modifique a função `getStatusColor` para personalizar as cores:

```javascript
const getStatusColor = (status) => {
  switch (status) {
    case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Em Oração': return 'bg-blue-100 text-blue-800 border-blue-200'
    // ... outros status
  }
}
```

## 🚀 Deploy e Produção

### Build para Produção
```bash
pnpm run build
```

### Preview da Build
```bash
pnpm run preview
```

### Deploy
O projeto pode ser facilmente deployado em plataformas como:
- Vercel
- Netlify
- GitHub Pages
- Servidor próprio

## 🤝 Contribuição

Este sistema foi desenvolvido para atender às necessidades específicas de grupos religiosos que desejam organizar e acompanhar pedidos de oração de forma digital e eficiente.

## 📝 Licença

Projeto desenvolvido para uso em comunidades religiosas. Sinta-se livre para adaptar às necessidades do seu grupo.

---

**Desenvolvido com ❤️ para fortalecer a comunhão e a oração em grupos religiosos.**
