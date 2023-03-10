import * as express from 'express';
import { MembersController } from '../controllers';
import { membersMiddleware, tokenMiddleare } from '../middlwares';
import { MembersService } from '../services';
import { MembersValidations } from '../services/validations';

const membersValidations = new MembersValidations();
const membersService = new MembersService(membersValidations);

const endpoint = '/:workspaceId';

const membersRouter = express.Router();

membersRouter.get(
  endpoint,
  tokenMiddleare,
  new MembersController(membersService).getter,
);

membersRouter.patch(
  '/:workspaceId/:accountId',
  tokenMiddleare,
  new MembersController(membersService).update,
);

membersRouter.put(
  endpoint,
  tokenMiddleare,
  membersMiddleware,
  new MembersController(membersService).create,
);

membersRouter.delete(
  endpoint,
  tokenMiddleare,
  new MembersController(membersService).remove,
);

export default membersRouter;