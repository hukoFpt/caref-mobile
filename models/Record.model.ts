import { Order } from "./Order.model";

export interface Record {
  _id: string;
  Status: string;   
  Order: Order;
  CreatedDate: string; 
  ModifiedDate: string; 
  ChildId: string; 
  ExpiredDate: string; 
}