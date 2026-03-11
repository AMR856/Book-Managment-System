export type Author = {
  id: number;
  name: string;
  email: string;
  birthDate?: string | null;
  nationality?: string | null;
  biography?: string | null;
};

export type Publisher = {
  id: number;
  name: string;
  email: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
};

export type Book = {
  id: number;
  title: string;
  isbn: string;
  year?: number | null;
  genre?: string | null;
  available?: boolean | null;
  quantity: number;
  authorId: number;
  publisherId: number;
  author?: Author;
  publisher?: Publisher;
};

export type Order = {
  id: number;
  bookId: number;
  userId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  book?: Book;
};
