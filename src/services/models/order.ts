export interface Order {
  orderId: number;
  customerName: string;
  carModel: string;
  configuration: string;
  totalPrice: number;
  orderStatus: string;
  orderDate: string;
  options: OrderOption[];
}

export interface CreateOrderRequest {
  userId: number;
  carId?: number; // Опционально - если не указан, создается новый автомобиль
  modelId?: number; // Обязательно, если carId не указан
  configurationId: number;
  color?: string; // Цвет для нового автомобиля
  optionIds: number[];
}

export interface OrderOption {
  optionName: string;
  price: number;
  quantity: number;
}