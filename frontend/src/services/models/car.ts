export interface Car {
  carId: number;
  modelId: number;
  brandName: string;
  modelName: string;
  bodyType: string;
  basePrice: number;
  color: string;
  status: string;
  vin: string;
  modelYear: number;
  fuelType: string;
  engineCapacity: number;
  configurationName?: string; // Название комплектации
}

export interface Configuration {
  configurationId: number;
  configurationName: string;
  description: string;
  additionalPrice: number;
}

export interface AdditionalOption {
  optionId: number;
  optionName: string;
  description: string;
  optionPrice: number;
  category: string;
}

export interface Model {
  modelId: number;
  brandName: string;
  modelName: string;
  bodyType: string;
  basePrice: number;
  modelYear: number;
  fuelType?: string;
  engineCapacity?: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  availableCount: number;
}