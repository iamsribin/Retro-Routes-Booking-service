import { StatusCode } from "./status-code";


export interface IResponse<T> {
  status: StatusCode;
  message: string;
  navigate?: string | number;
  data?: T | null | [] | boolean;
}