import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as sinon from 'sinon';
import App from '../../app';
import accountModel from '../../database/models/Accounts';
import accountWorkspacesModel from '../../database/models/AccountWorkspaces';
import userModel from '../../database/models/Users';
import { IAccountWorkspace, IToken } from '../../interfaces';
import { MembersService } from '../../services';
import { MembersValidations } from '../../services/validations';
import { tokenVerifyOutput, validToken } from '../mocks/account.mock';
import {
  createOutput, emailInUseNewMemberInput,
  emailInUseOutput, getMembersDatavalues, getMembersOutput, invalidInputs,
  invalidNewMemberInput,
  userModelOutput,
  validNewMemberInput
} from '../mocks/members.mock';
import { accountWorkspaceOutput } from '../mocks/workspaces.mock';

// @ts-ignore
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

const membersValidations = new MembersValidations();
const membersService = new MembersService(membersValidations);

const { app } = new App();
const { expect } = chai; 

describe('Members integration tests', function() {
  describe('getting workspace members', function() {
    afterEach(function() {
      sinon.restore();
    });


    it('with invalid id should return error', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(accountWorkspacesModel, 'findAll').resolves([]);

      const { body, status  } = await chai.request(app).get('/members/9999').set({ authorization: validToken });

      expect(status).to.be.equal(404);
      expect(body).to.be.deep.equal({ message: 'Workspace not found' });
    });

    it('successfully', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(userModel, 'findOne').resolves(userModelOutput as unknown as userModel);

      accountWorkspaceOutput[0].admin = true;

      sinon.stub(accountWorkspacesModel, 'findAll').resolves(accountWorkspaceOutput as IAccountWorkspace | any);
      sinon.stub(accountWorkspacesModel, 'create').resolves(createOutput as unknown as accountWorkspacesModel);
      sinon.stub(accountModel, 'findByPk')
        .onFirstCall().resolves(getMembersDatavalues[0] as unknown as accountModel)
        .onSecondCall().resolves(getMembersDatavalues[1] as unknown as accountModel)
        .onThirdCall().resolves(getMembersDatavalues[2] as unknown as accountModel);

        const { status, body } = await chai.request(app).get('/members/1').set({ authorization: validToken });

        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(getMembersOutput);
    });
  });

  describe('changing admin permissions', function() {
    afterEach(function() {
      sinon.restore();
    });

    it('when a user tries to change his own permissions it should return error', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);

      const { body, status  } = await chai.request(app).patch('/members/1/1').set({ authorization: validToken });

      expect(status).to.be.equal(401);
      expect(body).to.be.deep.equal({ message: 'Unauthorized' });
    });

    it('when a user tries to change the permissions of a non-member user', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(accountWorkspacesModel, 'findAll').resolves(accountWorkspaceOutput as IAccountWorkspace | any);
      sinon.stub(accountModel, 'findByPk')
        .onFirstCall().resolves(getMembersDatavalues[0] as unknown as accountModel)
        .onSecondCall().resolves(getMembersDatavalues[1] as unknown as accountModel)
        .onThirdCall().resolves(getMembersDatavalues[2] as unknown as accountModel);

      const { body, status  } = await chai.request(app).patch('/members/1/9999').set({ authorization: validToken });

      expect(status).to.be.equal(404);
      expect(body).to.be.deep.equal({ message: 'User not found' });
    });

    it('successfully', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(accountWorkspacesModel, 'findAll').resolves(accountWorkspaceOutput as IAccountWorkspace | any);
      sinon.stub(accountWorkspacesModel, 'update').resolves([1]);
      sinon.stub(accountModel, 'findByPk')
        .onFirstCall().resolves(getMembersDatavalues[0] as unknown as accountModel)
        .onSecondCall().resolves(getMembersDatavalues[1] as unknown as accountModel)
        .onThirdCall().resolves(getMembersDatavalues[2] as unknown as accountModel);

      const { body, status  } = await chai.request(app).patch('/members/1/2').set({ authorization: validToken });

      expect(status).to.be.equal(204);
    });
  });

  describe('adding new member', function() {
    afterEach(function() {
      sinon.restore();
    });
    
    invalidInputs.forEach(async (input, index) => {
      it(`${index + 1} - with invalid body it should return error`, async function() {
        sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
        const { body, status  } = await chai.request(app).put('/members/1').send(input).set({ authorization: validToken });
        expect(status).to.be.equal(400);
        expect(body).to.be.deep.equal({ message: 'Some required fields are missing' });
      });
    })

    it('adding user that does not exist should return error', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(userModel, 'findOne').resolves(undefined);
      sinon.stub(accountWorkspacesModel, 'findAll').resolves(accountWorkspaceOutput as IAccountWorkspace | any);
      sinon.stub(accountModel, 'findByPk')
        .onFirstCall().resolves(getMembersDatavalues[0] as unknown as accountModel)
        .onSecondCall().resolves(getMembersDatavalues[1] as unknown as accountModel)
        .onThirdCall().resolves(getMembersDatavalues[2] as unknown as accountModel);

      const { body, status  } = await chai.request(app).put('/members/1').send(invalidNewMemberInput).set({ authorization: validToken });

      expect(status).to.be.equal(404);
      expect(body).to.be.deep.equal({ message: 'User not found' });
    });

    it('add user who is member should return error', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(userModel, 'findOne').resolves(emailInUseOutput as unknown as userModel);

      sinon.stub(accountWorkspacesModel, 'findAll').resolves(accountWorkspaceOutput as IAccountWorkspace | any);
      sinon.stub(accountModel, 'findByPk')
        .onFirstCall().resolves(getMembersDatavalues[0] as unknown as accountModel)
        .onSecondCall().resolves(getMembersDatavalues[1] as unknown as accountModel)
        .onThirdCall().resolves(getMembersDatavalues[2] as unknown as accountModel);

      const { body, status  } = await chai.request(app).put('/members/1').send(emailInUseNewMemberInput).set({ authorization: validToken });

      expect(status).to.be.equal(401);
      expect(body).to.be.deep.equal({ message: 'The user is already a member' })
    });


    it('when the user is not admin it should return error', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(userModel, 'findOne').resolves(userModelOutput as unknown as userModel);

      accountWorkspaceOutput[0].admin = false;

      sinon.stub(accountWorkspacesModel, 'findAll').resolves(accountWorkspaceOutput as IAccountWorkspace | any);
      sinon.stub(accountModel, 'findByPk')
        .onFirstCall().resolves(getMembersDatavalues[0] as unknown as accountModel)
        .onSecondCall().resolves(getMembersDatavalues[1] as unknown as accountModel)
        .onThirdCall().resolves(getMembersDatavalues[2] as unknown as accountModel);

        const { body, status  } = await chai.request(app).put('/members/1').send(validNewMemberInput).set({ authorization: validToken });

        expect(status).to.be.equal(401);
        expect(body).to.be.deep.equal({ message: 'Unauthorized' });
    });

    it('successfully', async function() {
      sinon.stub(jwt, 'verify').returns(tokenVerifyOutput as IToken | any);
      sinon.stub(userModel, 'findOne').resolves(userModelOutput as unknown as userModel);

      accountWorkspaceOutput[0].admin = true;

      sinon.stub(accountWorkspacesModel, 'findAll').resolves(accountWorkspaceOutput as IAccountWorkspace | any);
      sinon.stub(accountWorkspacesModel, 'create').resolves(createOutput as unknown as accountWorkspacesModel);
      sinon.stub(accountModel, 'findByPk')
        .onFirstCall().resolves(getMembersDatavalues[0] as unknown as accountModel)
        .onSecondCall().resolves(getMembersDatavalues[1] as unknown as accountModel)
        .onThirdCall().resolves(getMembersDatavalues[2] as unknown as accountModel);

        const { status  } = await chai.request(app).put('/members/1').send(validNewMemberInput).set({ authorization: validToken });

        expect(status).to.be.equal(204);
    });
  });
});