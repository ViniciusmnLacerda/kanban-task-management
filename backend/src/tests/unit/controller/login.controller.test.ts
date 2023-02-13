import * as chai from 'chai';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as sinon from 'sinon';
import { LoginController } from '../../../controllers';
import userModel from '../../../database/models/Users';
import { IUser } from '../../../interfaces';
import { LoginService } from '../../../services';
import { token, user, validLoginInput } from '../../mocks/login.mock';

// @ts-ignore
import sinonChai = require('sinon-chai');

chai.use(sinonChai);

const loginController = new LoginController();
const loginService = new LoginService();
const { expect } = chai;

describe('Login controller tests', function() {
  afterEach(function() {
    sinon.restore();
  });
  
  it('successfully should return token', async function() {
    const req = {} as Request;
    const res = {} as Response;

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);

    sinon.stub(userModel, 'findOne').resolves(user as IUser | any);
    sinon.stub(jwt, 'sign').resolves(token);

    req.body = validLoginInput;

    await loginController.login(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith({ token });
  });
});