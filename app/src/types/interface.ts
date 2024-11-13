export interface UserData {
  id: string;
  email: string;
  fullname: string;
  phone: string;
}

export interface Product {
  id: string | null;
  name: string;
  description: string;
  category: string | null;
  quantity: number;
  price: number;
  userId: string;
  image1: string;
  image2: string;
  fullname: string | null;
}
