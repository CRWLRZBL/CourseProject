export interface Car {
  carId: number;
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