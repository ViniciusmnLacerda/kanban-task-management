import * as chai from 'chai';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import * as sinon from 'sinon';
import { WorkspacesController } from '../../../controllers';
import sequelize from '../../../database/models';
import accountWorkspacesModel from '../../../database/models/AccountWorkspaces';
import userModel from '../../../database/models/Users';
import workspacesModel from '../../../database/models/Workspaces';
import { IUser, IWorkspace } from '../../../interfaces';
import { MembersService, WorkspacesService } from '../../../services';
import { MembersValidations, WorkspacesValidations } from '../../../services/validations';
import { tokenVerifyOutput } from '../../mocks/account.mock';
import { createOutput, getWorkspacesOutput, membersOutput, validCreateInput } from '../../mocks/workspaces.mock';

// @ts-ignore
import sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { expect } = chai;

const membersValidations = new MembersValidations();
const membersService = new MembersService(membersValidations);
const workspacesValidations = new WorkspacesValidations();
const workspacesService = new WorkspacesService(membersService, workspacesValidations);
const workspacesController = new WorkspacesController(workspacesService);

describe('Workspaces controller test', function() {
  describe('getting the list of workspaces', function() {
    afterEach(function() {
      sinon.restore();
    });

    it('successfully', async function() {
      const req = {} as Request;
      const res = {} as Response;
  
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
  
      sinon.stub(accountWorkspacesModel, 'findAll').resolves(getWorkspacesOutput as unknown as accountWorkspacesModel[]);
  
      req.body = { user: { ...tokenVerifyOutput } };
      
      req.params = { accountId: '1' }
  
      await workspacesController.getter(req, res);
  
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(getWorkspacesOutput);
    });
  })

  describe('creating a new workspace', function() {
    afterEach(function() {
      sinon.restore();
    });

    it('successfully', async function() {
      const req = {} as Request;
      const res = {} as Response;
  
      res.status = sinon.stub().returns(res);
      res.end = sinon.stub().returns(res);
      
      sinon.stub(sequelize, 'transaction').resolves(createOutput as unknown as Transaction);
      sinon.stub(userModel, 'findOne')
        .onFirstCall().returns({ id: 1 } as IUser | any)
        .onSecondCall().returns({ id: 2 } as IUser | any)
        .onThirdCall().returns({ id: 4 } as IUser | any);
      sinon.stub(workspacesModel, 'create').resolves({ id: 5 } as IWorkspace | any);
      sinon.stub(accountWorkspacesModel, 'create')
        .onFirstCall().returns({ accountId: 1, workspaceId: 5, admin: true } as IWorkspace | any)
        .onSecondCall().returns({ accountId: 2, workspaceId: 5, admin: false } as IWorkspace | any)
        .onThirdCall().returns({ accountId: 4, workspaceId: 5, admin: false } as IWorkspace | any);
  
      req.body = { ...validCreateInput, user: { ...tokenVerifyOutput } };
      
      await workspacesController.create(req, res);
  
      expect(res.status).to.have.been.calledWith(201);
    });
  });

  describe('Deleting workspace', function() {
    afterEach(function() {
      sinon.restore();
    });

    it('successfully', async function() {
      const req = {} as Request;
      const res = {} as Response;
  
      res.status = sinon.stub().returns(res);
      res.end = sinon.stub().returns(res);
      
      sinon.stub(membersService, 'getter').resolves(membersOutput);
      sinon.stub(accountWorkspacesModel, 'destroy').resolves(1);
      sinon.stub(workspacesModel, 'destroy').resolves(1);
      sinon.stub(sequelize, 'transaction').resolves();

      req.body = { user: { ...tokenVerifyOutput } };
      req.params = { workspaceId: '1' };
      
      await workspacesController.remove(req, res);
  
      expect(res.status).to.have.been.calledWith(204);
    });
  })

  describe('Updating workspace name', function() {
    afterEach(function() {
      sinon.restore();
    });

    it('successfully', async function() {
      const req = {} as Request;
      const res = {} as Response;
  
      res.status = sinon.stub().returns(res);
      res.end = sinon.stub().returns(res);
      
      sinon.stub(membersService, 'getter').resolves(membersOutput);
      sinon.stub(workspacesModel, 'update').resolves([1]);

      req.body = { name: validCreateInput, user: { ...tokenVerifyOutput } };
      req.params = { workspaceId: '1' };
      
      await workspacesController.update(req, res);
  
      expect(res.status).to.have.been.calledWith(204);
    });
  })
});