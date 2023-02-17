import { IToken } from '../../interfaces';

export default interface Iservice<T, E, U> {
  getAll: (arg0: number, arg1: IToken) => Promise<T>;
  create: (arg0: U, arg1: E, arg2: IToken) => Promise<void>;
  remove: (arg0: number, arg1: IToken, arg2?: string) => Promise<void> 
  update: (arg0: number, arg1: U, user: IToken) => Promise<void>;
}