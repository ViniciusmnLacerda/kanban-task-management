import { Request, Response } from 'express';
import { WorkspacesService } from '../services';

const workspacesService = new WorkspacesService();

export default class WorkspacesController {
  public getAll = async (req: Request, res: Response): Promise<void> => {
    const { accountId } = req.params;
    const user = req.body;
    const workspaces = await workspacesService.getAll(+accountId, user);
    res.status(200).json(workspaces);
  };
}