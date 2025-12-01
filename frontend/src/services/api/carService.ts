import { apiClient } from './apiClient';
import { Car, Configuration, AdditionalOption } from '../models/car';

export const carService = {
  async getCars(brand?: string, bodyType?: string): Promise<Car[]> {
    const params = new URLSearchParams();
    if (brand) params.append('brand', brand);
    if (bodyType) params.append('bodyType', bodyType);
    
    const response = await apiClient.get<Car[]>(`/cars?${params}`);
    return response.data;
  },

  async getCarById(id: number): Promise<Car> {
    const response = await apiClient.get<Car>(`/cars/${id}`);
    return response.data;
  },

  async getConfigurations(carId: number): Promise<Configuration[]> {
    const response = await apiClient.get<Configuration[]>(`/cars/${carId}/configurations`);
    return response.data;
  },

  async getAdditionalOptions(): Promise<AdditionalOption[]> {
    const response = await apiClient.get<AdditionalOption[]>('/cars/options');
    return response.data;
  },

  async getBrands(): Promise<{ brandId: number; brandName: string }[]> {
    const response = await apiClient.get('/cars/brands');
    return response.data;
  },

  async getBodyTypes(): Promise<string[]> {
    const response = await apiClient.get('/cars/filters/body-types');
    return response.data;
  }
};