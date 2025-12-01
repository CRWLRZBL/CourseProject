import { apiClient } from './apiClient';
import { User, LoginRequest, RegisterRequest } from '../models/user';

export const authService = {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await apiClient.post<{ user: User; token: string } | User>('/auth/login', credentials);
    
    // Handle different response formats
    let userData: User;
    let token: string | null = null;
    
    if ('user' in response.data && 'token' in response.data) {
      // Response format: { user: User, token: string }
      userData = response.data.user;
      token = response.data.token;
    } else if ('token' in response.data) {
      // Response format: User with token property
      userData = response.data as unknown as User;
      token = (response.data as any).token;
    } else {
      // Response format: just User, check headers for token
      userData = response.data as User;
      // Axios normalizes headers to lowercase
      const authHeader = response.headers['authorization'] || response.headers['x-auth-token'];
      token = authHeader ? (typeof authHeader === 'string' ? authHeader.replace(/^Bearer\s+/i, '') : authHeader) : null;
    }
    
    // Save token if found
    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    return userData;
  },

  async register(userData: RegisterRequest): Promise<{ message: string; userId: number }> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roleName === 'Admin';
  }
};