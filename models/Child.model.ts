export interface Child {
  _id: string;
  memberID: number;
  fname: string;
  lname: string;
  birthdate: string;
  gender: string;
  picture: string;
  bloodType: "A-" | "A+" | "B-" | "B+" | "AB-" | "AB+" | "O-" | "O+";
  allergy: string;
  notes: string;
}