export interface BookData {
  title: string;
  isbn: string;
  year?: number;
  genre?: string;
  available?: boolean;
  quantity?: number;
  authorId: number;
  publisherId: number;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
