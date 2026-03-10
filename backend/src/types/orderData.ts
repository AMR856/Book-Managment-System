export interface OrderData {
  id?: number;
  userId?: number;
  bookId: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
