export interface Order {
  _id: string;
  memberId: string;
  serviceName: string;
  serviceCode: string;
  status: string;
  orderCode: string;
  amount: number;
  description: string;
  createdAt: string;
  __v: number;
}