import type { Dayjs } from "dayjs";

export interface IOrderChart {
  count: number;
  status:
    | "waiting"
    | "ready"
    | "on the way"
    | "delivered"
    | "could not be delivered";
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

export interface IStatus {
  id: number;
  text:
    | "Pending"
    | "Ready"
    | "On The Way"
    | "Delivered"
    | "Cancelled"
    | "Offline";
}

export interface IRole {
  name: string;
  type: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  city: string;
  birthDate: string;
  createdAt: string;
  isActive: boolean;
  avatar: IFile & { thumbnail?: IFile };
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  created_at: string;
  updated_at: string;
  role: IRole;
}

export interface IFile {
  name: string;
  percent: number;
  size: number;
  status: "error" | "success" | "done" | "uploading" | "removed";
  type: string;
  uid: string;
  url: string;
}

export interface IEvent {
  createdAt: string;
  status: IStatus;
}

export interface ICustomer {
  id: number;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  user: IUser;
}

export interface IStore {
  id: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  gsm: string;
  email: string;
}

export interface ICourierStatus {
  id: number;
  text: "Available" | "Offline" | "On delivery";
}

export interface ICourier {
  id: number;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  title: string;
  licensePlate: string;
  status: IStatus;
  user: IUser;
  store: IStore;
}

export interface IOrder {
  id: number;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  orderNumber: number;
  product: IProduct;
  amount: number;
  status: IStatus;
  events: IEvent[];
  customer: ICustomer;
  courier: ICourier;
}

export interface IProduct {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
  image: IFile & { thumbnail?: IFile };
  createdAt: string;
  price: number;
  category: {
    id: number;
    title: string;
  };
  metadata: IMetadata[];
}

export interface ICategory {
  id: number;
  title: string;
  isActive: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  createdAt?: [Dayjs, Dayjs];
  status?: string;
}

export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

export interface IReview {
  id: number;
  order: IOrder;
  user: IUser;
  star: number;
  createDate: string;
  status: "pending" | "approved" | "rejected";
  comment: string[];
}

export type IVehicle = {
  model: string;
  vehicleType: string;
  engineSize: number;
  color: string;
  year: number;
  id: number;
};

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  sales: number;
}

export interface IMetadata {
  key: string;
  formula: string;
  value: string | number;
}

export interface IOrderMetadata {
  product: { metadata: IMetadata[] };
}
