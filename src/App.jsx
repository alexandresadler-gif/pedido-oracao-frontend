import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Plus, Edit, Trash2, MessageCircle, Calendar, User, Phone, Mail, Heart, Search, Bell, Send, CheckCircle, Clock, Archive, LogOut, Settings } from 'lucide-react'
import Login from './components/Login'
import ApiService from './services/api'
import './App.css'

function App() {
  // Estados de autenticação
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Estados da aplicação
  const [pedidos, setPedidos] = useState([])
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    pendentes: 0,
    em_oracao: 0,
    respondidos: 0,
    arquivados: 0
  })
  const [novoPedido, setNovoPedido] = useState({
    titulo: '',
    descricao: '',
    nome_solicitante: '',
    celular_solicitante: '',
    email_solicitante: ''
  })
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [termoBusca, setTermoBusca] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [dialogComentario, setDialogComentario] = useState(false)
  const [pedidoEditando, setPedidoEditando] = useState(null)
  const [pedidoComentando, setPedidoComentando] = useState(null)
  const [novoComentario, setNovoComentario] = useState('')
  const [notificacoes, setNotificacoes] = useState([])
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false)
  const [error, setError] = useState('')

  const statusOptions = ['Pendente', 'Em Oração', 'Respondido', 'Arquivado']

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      if (ApiService.isAuthenticated()) {
        try {
          const response = await ApiService.verifyToken()
          setUser(response.user)
          await carregarDados()
        } catch (error) {
          console.error('Token inválido:', error)
          ApiService.logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Carregar dados do backend
  const carregarDados = async () => {
    try {
      const [pedidosData, estatisticasData] = await Promise.all([
        ApiService.getPedidos(),
        ApiService.getEstatisticas()
      ])
      
      setPedidos(pedidosData)
      setEstatisticas(estatisticasData)
    } catch (error) {
      setError('Erro ao carregar dados: ' + error.message)
    }
  }

  // Função de login
  const handleLogin = (userData) => {
    setUser(userData)
    carregarDados()
  }

  // Função de logout
  const handleLogout = () => {
    ApiService.logout()
    setUser(null)
    setPedidos([])
    setEstatisticas({
      total: 0,
      pendentes: 0,
      em_oracao: 0,
      respondidos: 0,
      arquivados: 0
    })
  }

  // Criar novo pedido
  const criarPedido = async () => {
    if (!novoPedido.titulo || !novoPedido.descricao || !novoPedido.nome_solicitante) {
      setError('Título, descrição e nome do solicitante são obrigatórios')
      return
    }

    try {
      const pedidoCriado = await ApiService.createPedido(novoPedido)
      
      setNovoPedido({
        titulo: '',
        descricao: '',
        nome_solicitante: '',
        celular_solicitante: '',
        email_solicitante: ''
      })
      setDialogAberto(false)
      
      // Recarregar dados
      await carregarDados()
      
      // Adicionar notificação
      adicionarNotificacao(`Pedido "${pedidoCriado.titulo}" criado com sucesso`)
    } catch (error) {
      setError('Erro ao criar pedido: ' + error.message)
    }
  }

  // Atualizar pedido
  const atualizarPedido = async () => {
    if (!pedidoEditando) return

    try {
      await ApiService.updatePedido(pedidoEditando.id, pedidoEditando)
      setPedidoEditando(null)
      setDialogAberto(false)
      
      // Recarregar dados
      await carregarDados()
      
      adicionarNotificacao(`Pedido "${pedidoEditando.titulo}" atualizado com sucesso`)
    } catch (error) {
      setError('Erro ao atualizar pedido: ' + error.message)
    }
  }

  // Excluir pedido
  const excluirPedido = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return

    try {
      await ApiService.deletePedido(id)
      
      // Recarregar dados
      await carregarDados()
      
      adicionarNotificacao('Pedido excluído com sucesso')
    } catch (error) {
      setError('Erro ao excluir pedido: ' + error.message)
    }
  }

  // Atualizar status (apenas admins)
  const atualizarStatus = async (id, novoStatus) => {
    try {
      await ApiService.updateStatus(id, novoStatus)
      
      // Recarregar dados
      await carregarDados()
      
      adicionarNotificacao(`Status atualizado para "${novoStatus}"`)
    } catch (error) {
      setError('Erro ao atualizar status: ' + error.message)
    }
  }

  // Adicionar comentário
  const adicionarComentario = async () => {
    if (!novoComentario.trim() || !pedidoComentando) return

    try {
      await ApiService.addComentario(pedidoComentando.id, novoComentario)
      
      setNovoComentario('')
      setDialogComentario(false)
      setPedidoComentando(null)
      
      // Recarregar dados
      await carregarDados()
      
      adicionarNotificacao(`Comentário adicionado ao pedido "${pedidoComentando.titulo}"`)
    } catch (error) {
      setError('Erro ao adicionar comentário: ' + error.message)
    }
  }

  // Buscar pedidos
  const buscarPedidos = async () => {
    try {
      const resultados = await ApiService.buscarPedidos(termoBusca, filtroStatus)
      setPedidos(resultados)
    } catch (error) {
      setError('Erro na busca: ' + error.message)
    }
  }

  // Adicionar notificação
  const adicionarNotificacao = (mensagem) => {
    const novaNotificacao = {
      id: Date.now(),
      mensagem,
      timestamp: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    setNotificacoes(prev => [novaNotificacao, ...prev.slice(0, 4)])
  }

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchStatus = filtroStatus === 'todos' || pedido.status === filtroStatus
    const matchBusca = !termoBusca || 
      pedido.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pedido.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      pedido.nome_solicitante.toLowerCase().includes(termoBusca.toLowerCase())
    
    return matchStatus && matchBusca
  })

  // Funções auxiliares
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Em Oração': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Respondido': return 'bg-green-100 text-green-800 border-green-200'
      case 'Arquivado': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pendente': return <Clock className="h-4 w-4" />
      case 'Em Oração': return <Heart className="h-4 w-4" />
      case 'Respondido': return <CheckCircle className="h-4 w-4" />
      case 'Arquivado': return <Archive className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatarData = (dataString) => {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }

  // Loading inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Tela de login
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Pedidos de Oração</h1>
                <p className="text-sm text-gray-600">Compartilhe seus pedidos e acompanhe as respostas de Deus</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.nome_completo || user.username}</p>
                <p className="text-xs text-gray-500">
                  {user.is_admin ? 'Administrador' : 'Membro'}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError('')}
                className="ml-2 h-auto p-0 text-red-700 hover:text-red-900"
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{estatisticas.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{estatisticas.em_oracao}</div>
                <div className="text-sm text-gray-600">Em Oração</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{estatisticas.respondidos}</div>
                <div className="text-sm text-gray-600">Respondidos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{estatisticas.arquivados}</div>
                <div className="text-sm text-gray-600">Arquivados</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido de Oração
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {pedidoEditando ? 'Editar Pedido' : 'Novo Pedido de Oração'}
                </DialogTitle>
                <DialogDescription>
                  {pedidoEditando ? 'Edite as informações do pedido' : 'Compartilhe seu pedido com o grupo'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título/Assunto</Label>
                  <Input
                    id="titulo"
                    value={pedidoEditando ? pedidoEditando.titulo : novoPedido.titulo}
                    onChange={(e) => {
                      if (pedidoEditando) {
                        setPedidoEditando({...pedidoEditando, titulo: e.target.value})
                      } else {
                        setNovoPedido({...novoPedido, titulo: e.target.value})
                      }
                    }}
                    placeholder="Ex: Saúde da família"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição do Pedido</Label>
                  <Textarea
                    id="descricao"
                    value={pedidoEditando ? pedidoEditando.descricao : novoPedido.descricao}
                    onChange={(e) => {
                      if (pedidoEditando) {
                        setPedidoEditando({...pedidoEditando, descricao: e.target.value})
                      } else {
                        setNovoPedido({...novoPedido, descricao: e.target.value})
                      }
                    }}
                    placeholder="Descreva seu pedido de oração..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="nome">Nome do Solicitante</Label>
                  <Input
                    id="nome"
                    value={pedidoEditando ? pedidoEditando.nome_solicitante : novoPedido.nome_solicitante}
                    onChange={(e) => {
                      if (pedidoEditando) {
                        setPedidoEditando({...pedidoEditando, nome_solicitante: e.target.value})
                      } else {
                        setNovoPedido({...novoPedido, nome_solicitante: e.target.value})
                      }
                    }}
                    placeholder="Seu nome"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="celular">Celular (opcional)</Label>
                    <Input
                      id="celular"
                      value={pedidoEditando ? pedidoEditando.celular_solicitante : novoPedido.celular_solicitante}
                      onChange={(e) => {
                        if (pedidoEditando) {
                          setPedidoEditando({...pedidoEditando, celular_solicitante: e.target.value})
                        } else {
                          setNovoPedido({...novoPedido, celular_solicitante: e.target.value})
                        }
                      }}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={pedidoEditando ? pedidoEditando.email_solicitante : novoPedido.email_solicitante}
                      onChange={(e) => {
                        if (pedidoEditando) {
                          setPedidoEditando({...pedidoEditando, email_solicitante: e.target.value})
                        } else {
                          setNovoPedido({...novoPedido, email_solicitante: e.target.value})
                        }
                      }}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setDialogAberto(false)
                    setPedidoEditando(null)
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={pedidoEditando ? atualizarPedido : criarPedido}>
                    {pedidoEditando ? 'Atualizar' : 'Submeter'} Pedido
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pedidos..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {notificacoes.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificacoes.length}
                  </span>
                )}
              </Button>
              
              {mostrarNotificacoes && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Notificações Recentes</h3>
                    {notificacoes.length === 0 ? (
                      <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                    ) : (
                      <div className="space-y-2">
                        {notificacoes.map(notif => (
                          <div key={notif.id} className="text-sm p-2 bg-gray-50 rounded">
                            <p className="text-gray-800">{notif.mensagem}</p>
                            <p className="text-gray-500 text-xs mt-1">{notif.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-6">
          {pedidosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-500">
                  {termoBusca || filtroStatus !== 'todos' 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Seja o primeiro a compartilhar um pedido de oração'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            pedidosFiltrados.map(pedido => (
              <Card key={pedido.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{pedido.titulo}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {pedido.nome_solicitante}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatarData(pedido.data_submissao)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getStatusColor(pedido.status)} flex items-center space-x-1`}>
                        {getStatusIcon(pedido.status)}
                        <span>{pedido.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4">{pedido.descricao}</p>
                  
                  {/* Informações de Contato */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {pedido.celular_solicitante && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {pedido.celular_solicitante}
                      </div>
                    )}
                    {pedido.email_solicitante && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {pedido.email_solicitante}
                      </div>
                    )}
                  </div>

                  {/* Controles de Status (apenas para admins) */}
                  {user.is_admin && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium">Atualizar Status:</Label>
                      <div className="flex gap-2 mt-1">
                        {statusOptions.map(status => (
                          <Button
                            key={status}
                            variant={pedido.status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => atualizarStatus(pedido.id, status)}
                            className="text-xs"
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comentários */}
                  {pedido.comentarios && pedido.comentarios.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          Comentários e Testemunhos ({pedido.comentarios.length})
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {pedido.comentarios.map(comentario => (
                          <div key={comentario.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm">{comentario.autor}</span>
                              <span className="text-xs text-gray-500">
                                {formatarData(comentario.data_comentario)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comentario.conteudo}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPedidoComentando(pedido)
                        setDialogComentario(true)
                      }}
                      title="Adicionar comentário"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    
                    {(user.is_admin || pedido.usuario_criador_id === user.id) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPedidoEditando(pedido)
                            setDialogAberto(true)
                          }}
                          title="Editar pedido"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => excluirPedido(pedido.id)}
                          title="Excluir pedido"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Dialog de Comentário */}
        <Dialog open={dialogComentario} onOpenChange={setDialogComentario}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Comentário</DialogTitle>
              <DialogDescription>
                Compartilhe uma atualização ou testemunho sobre este pedido
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="comentario">Seu comentário</Label>
                <Textarea
                  id="comentario"
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Compartilhe uma atualização, testemunho ou palavra de encorajamento..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setDialogComentario(false)
                  setNovoComentario('')
                  setPedidoComentando(null)
                }}>
                  Cancelar
                </Button>
                <Button onClick={adicionarComentario}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Comentário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default App
