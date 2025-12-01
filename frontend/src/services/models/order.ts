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
  carId: number;
  configurationId: number;
  optionIds: number[];
}

export interface OrderOption {
  optionName: string;
  price: number;
  quantity: number;
}