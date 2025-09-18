// Serviço de API para comunicação com o backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Configurar headers padrão
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (data.token) {
      this.token = data.token;
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
    }

    return data;
  }

  async register(userData) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyToken() {
    try {
      return await this.request('/auth/verify-token');
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Métodos para pedidos de oração
  async getPedidos() {
    return await this.request('/pedidos');
  }

  async getPedido(id) {
    return await this.request(`/pedidos/${id}`);
  }

  async createPedido(pedidoData) {
    return await this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedidoData),
    });
  }

  async updatePedido(id, pedidoData) {
    return await this.request(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pedidoData),
    });
  }

  async deletePedido(id) {
    return await this.request(`/pedidos/${id}`, {
      method: 'DELETE',
    });
  }

  async updateStatus(id, status) {
    return await this.request(`/pedidos/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Métodos para comentários
  async addComentario(pedidoId, conteudo) {
    return await this.request(`/pedidos/${pedidoId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({ conteudo }),
    });
  }

  async getComentarios(pedidoId) {
    return await this.request(`/pedidos/${pedidoId}/comentarios`);
  }

  // Métodos para estatísticas e busca
  async getEstatisticas() {
    return await this.request('/pedidos/estatisticas');
  }

  async buscarPedidos(termo, status) {
    const params = new URLSearchParams();
    if (termo) params.append('q', termo);
    if (status && status !== 'todos') params.append('status', status);
    
    return await this.request(`/pedidos/buscar?${params.toString()}`);
  }

  // Métodos para usuários (admin)
  async getUsers() {
    return await this.request('/auth/users');
  }

  async toggleAdmin(userId) {
    return await this.request(`/auth/users/${userId}/admin`, {
      method: 'PUT',
    });
  }

  // Verificar se o usuário está logado
  isAuthenticated() {
    return !!this.token;
  }

  // Obter dados do usuário do localStorage
  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}

export default new ApiService();
