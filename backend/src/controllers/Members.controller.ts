import { Request, Response } from 'express';
import { MembersService } from '../services';
import IController from './interfaces/IController';

export default class MembersController implements IController {
  constructor(private readonly service: MembersService) {
    this.service = service;
  }

  public getter = async (req: Request, res: Response): Promise<void> => {
    const { workspaceId } = req.params;
    const { user } = req.body;
    const members = await this.service.getter(+workspaceId, user);
    res.status(200).json(members);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { user } = req.body;
    const { workspaceId, accountId } = req.params;   
    await this.service.update({ id: +workspaceId, key: +accountId }, user);
    res.status(204).end();
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { email, admin, user } = req.body;
    const { workspaceId } = req.params; 
    const newMember = { workspaceId: +workspaceId, email, admin };
    await this.service.create(newMember, user);
    res.status(204).end();
  };

  public remove = async (req: Request, res: Response): Promise<void> => {
    const { email, user } = req.body;
    const { workspaceId } = req.params; 
    await this.service.remove({ id: +workspaceId, email }, user);
    res.status(204).end();
  };
}