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
  },

  // Методы для конфигуратора (если API поддерживает)
  async getAvailableColors(carId: number): Promise<{ colorId: number; colorName: string; colorCode: string; priceModifier: number }[]> {
    try {
      const response = await apiClient.get(`/cars/${carId}/colors`);
      return response.data;
    } catch (error) {
      // Если API не поддерживает, возвращаем пустой массив
      return [];
    }
  },

  async getAvailableEngines(carId: number): Promise<{ engineId: number; engineName: string; engineCapacity: number; power: number; fuelType: string; priceModifier: number }[]> {
    try {
      const response = await apiClient.get(`/cars/${carId}/engines`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getAvailableTransmissions(carId: number): Promise<{ transmissionId: number; transmissionName: string; transmissionType: string; gears: number; priceModifier: number }[]> {
    try {
      const response = await apiClient.get(`/cars/${carId}/transmissions`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
};