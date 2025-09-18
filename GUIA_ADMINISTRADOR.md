# Guia do Administrador - Sistema de Pedidos de Oração

Este guia fornece instruções detalhadas para administradores que desejam configurar e gerenciar o Sistema de Pedidos de Oração.

## 🔧 Configuração Inicial

### Requisitos do Sistema
- **Servidor Web**: Qualquer servidor que suporte arquivos estáticos
- **Navegadores Suportados**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Dispositivos**: Desktop, tablet e mobile
- **Conexão**: Internet necessária apenas para carregamento inicial

### Instalação em Servidor Local

1. **Preparação do Ambiente**:
   ```bash
   # Instalar Node.js (versão 18 ou superior)
   # Instalar pnpm: npm install -g pnpm
   ```

2. **Configuração do Projeto**:
   ```bash
   cd sistema-pedidos-oracao
   pnpm install
   pnpm run build
   ```

3. **Deploy dos arquivos**:
   - Copie o conteúdo da pasta `dist/` para seu servidor web
   - Configure o servidor para servir `index.html` como página principal

## 👥 Gerenciamento de Usuários

### Perfis de Usuário

#### Membros do Grupo
- **Permissões**:
  - Criar novos pedidos de oração
  - Editar seus próprios pedidos (enquanto pendentes)
  - Visualizar todos os pedidos aprovados
  - Adicionar comentários e testemunhos
  - Excluir seus próprios pedidos (enquanto pendentes)

#### Administradores/Líderes
- **Permissões Adicionais**:
  - Editar qualquer pedido
  - Excluir qualquer pedido
  - Alterar status de qualquer pedido
  - Moderar comentários
  - Visualizar estatísticas completas

### Configuração de Permissões

Atualmente, o sistema não possui autenticação integrada. Para implementar controle de acesso:

1. **Opção 1 - Controle por IP/Rede**:
   - Configure o servidor web para restringir acesso por IP
   - Ideal para grupos pequenos em rede local

2. **Opção 2 - Integração com Sistema de Login**:
   - Integre com sistema de autenticação existente
   - Modifique o código para verificar permissões

## 📊 Monitoramento e Relatórios

### Estatísticas Disponíveis
- **Total de Pedidos**: Contador geral
- **Por Status**: Pendentes, Em Oração, Respondidos, Arquivados
- **Atividade Recente**: Através do sistema de notificações

### Exportação de Dados

Para exportar dados dos pedidos, você pode:

1. **Backup Manual**:
   - Os dados ficam armazenados no localStorage do navegador
   - Use as ferramentas de desenvolvedor para acessar

2. **Implementação de Backup Automático**:
   ```javascript
   // Adicione esta função ao código para exportar dados
   const exportarDados = () => {
     const dados = {
       pedidos: pedidos,
       dataExportacao: new Date()
     }
     const blob = new Blob([JSON.stringify(dados, null, 2)], 
       { type: 'application/json' })
     const url = URL.createObjectURL(blob)
     const a = document.createElement('a')
     a.href = url
     a.download = `backup-pedidos-${new Date().toISOString().split('T')[0]}.json`
     a.click()
   }
   ```

## 🔒 Segurança e Privacidade

### Proteção de Dados
- **Dados Locais**: Atualmente armazenados no navegador (localStorage)
- **Sem Servidor**: Não há transmissão de dados para servidores externos
- **Privacidade**: Dados ficam apenas no dispositivo do usuário

### Recomendações de Segurança

1. **Backup Regular**:
   - Implemente rotina de backup dos dados
   - Mantenha backups em local seguro

2. **Acesso Controlado**:
   - Use HTTPS em produção
   - Configure firewall se necessário
   - Considere VPN para acesso remoto

3. **Política de Privacidade**:
   - Defina regras claras sobre uso dos dados
   - Informe os usuários sobre armazenamento local
   - Estabeleça procedimentos para exclusão de dados

## 🛠️ Manutenção e Atualizações

### Manutenção Preventiva

1. **Limpeza de Dados**:
   ```javascript
   // Função para arquivar pedidos antigos automaticamente
   const arquivarPedidosAntigos = () => {
     const treseMesesAtras = new Date()
     treseMesesAtras.setMonth(treseMesesAtras.getMonth() - 3)
     
     setPedidos(prev => prev.map(pedido => 
       pedido.status === 'Respondido' && 
       pedido.dataUltimaAtualizacao < treseMesesAtras
         ? { ...pedido, status: 'Arquivado' }
         : pedido
     ))
   }
   ```

2. **Monitoramento de Performance**:
   - Verifique velocidade de carregamento
   - Monitore uso de memória do navegador
   - Teste em diferentes dispositivos

### Atualizações do Sistema

1. **Backup Antes de Atualizar**:
   - Sempre faça backup dos dados
   - Teste em ambiente separado primeiro

2. **Processo de Atualização**:
   ```bash
   # Backup dos dados atuais
   # Baixar nova versão
   # Testar funcionalidades
   # Deploy da nova versão
   # Verificar funcionamento
   ```

## 📋 Procedimentos Operacionais

### Rotina Diária
- [ ] Verificar novos pedidos pendentes
- [ ] Revisar e aprovar pedidos
- [ ] Responder comentários se necessário
- [ ] Atualizar status conforme necessário

### Rotina Semanal
- [ ] Revisar estatísticas
- [ ] Arquivar pedidos respondidos antigos
- [ ] Verificar funcionamento do sistema
- [ ] Backup dos dados

### Rotina Mensal
- [ ] Análise completa das estatísticas
- [ ] Limpeza de dados desnecessários
- [ ] Verificação de atualizações disponíveis
- [ ] Revisão de procedimentos

## 🆘 Solução de Problemas

### Problemas Comuns

1. **Dados Perdidos**:
   - **Causa**: Limpeza do cache do navegador
   - **Solução**: Restaurar do backup
   - **Prevenção**: Implementar backup automático

2. **Sistema Lento**:
   - **Causa**: Muitos pedidos acumulados
   - **Solução**: Arquivar pedidos antigos
   - **Prevenção**: Limpeza regular

3. **Não Carrega no Mobile**:
   - **Causa**: Problemas de responsividade
   - **Solução**: Verificar CSS e viewport
   - **Prevenção**: Testes regulares em dispositivos

### Contatos de Suporte

Para problemas técnicos mais complexos:
- Consulte a documentação técnica
- Verifique logs do navegador (F12 > Console)
- Teste em navegador diferente
- Verifique conexão de internet

## 📈 Melhorias Futuras

### Funcionalidades Sugeridas
1. **Sistema de Login**: Autenticação de usuários
2. **Banco de Dados**: Armazenamento persistente
3. **Notificações Push**: Alertas em tempo real
4. **Relatórios Avançados**: Gráficos e análises
5. **App Mobile**: Versão nativa para smartphones
6. **Integração Email**: Envio automático de atualizações

### Implementação Gradual
- Priorize funcionalidades mais solicitadas
- Teste cada nova funcionalidade isoladamente
- Mantenha sempre backup antes de implementar
- Colete feedback dos usuários regularmente

---

**Este guia deve ser atualizado conforme novas funcionalidades são implementadas e novos procedimentos são estabelecidos.**
