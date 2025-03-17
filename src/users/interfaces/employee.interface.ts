export interface AllEmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: {
    id: number;
    name: string;
  };
}
