/**
 * Products API client
 */
import { apiClient, ApiResponse } from './client';

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  categoria: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export class ProductoService {
  public async getAllProductos(): Promise<Producto[]> {
    const response = await apiClient.get<Producto[]>('/api/productos');
    return response.data || [];
  }

  public async getProductoById(id: number): Promise<Producto> {
    const response = await apiClient.get<Producto>(`/api/productos/${id}`);
    if (!response.data) throw new Error('Producto no encontrado');
    return response.data;
  }

  public async getProductosByCategoria(categoria: string): Promise<Producto[]> {
    const response = await apiClient.get<Producto[]>(`/api/productos/categoria/${categoria}`);
    return response.data || [];
  }

  public async createProducto(producto: Partial<Producto>): Promise<Producto> {
    const response = await apiClient.post<Producto>('/api/productos', producto);
    if (!response.data) throw new Error('Error creating producto');
    return response.data;
  }

  public async updateProducto(id: number, producto: Partial<Producto>): Promise<Producto> {
    const response = await apiClient.put<Producto>(`/api/productos/${id}`, producto);
    if (!response.data) throw new Error('Error updating producto');
    return response.data;
  }

  public async deleteProducto(id: number): Promise<void> {
    await apiClient.delete(`/api/productos/${id}`);
  }
}

export const productoService = new ProductoService();
