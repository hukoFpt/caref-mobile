export interface User {
  _id: string;
  email: string;
  role: string;
  userName: string;
}

export const mapUserResponseToUser = (response: any): User => {
  return {
    _id: response.user.id,
    email: response.user.email,
    role: response.user.role,
    userName: response.user.userName,
  };
};
