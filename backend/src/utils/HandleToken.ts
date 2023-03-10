import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { IToken, IUser } from '../interfaces';
import { IHandleToken } from './interfaces';

export default class HandleToken implements IHandleToken {
  private secret: jwt.Secret = process.env.JWT_SECRET || 'jwt_secret';

  private jwtConfig: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: '1d',
  };

  public createToken = ({ id, email }: IUser): IToken => {
    const token = jwt.sign({ userId: id, email }, this.secret, this.jwtConfig);
    return token as unknown as IToken;
  };

  public verifyToken = (token: string): IToken => {
    const user = jwt.verify(token, this.secret);
    return user as IToken;
  };
}