import { Request, Response } from 'express';
import { ColumnService } from '../services';
import IController from './interfaces/IController';

export default class ColumnController implements IController {
  constructor(private readonly service: ColumnService) {
    this.service = service;
  }

  public getter = async (req: Request, res: Response): Promise<void> => {
    const { workspaceId } = req.params;
    const { user } = req.body;
    const columns = await this.service.getter(+workspaceId, user);
    res.status(200).json(columns);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { workspaceId } = req.params;
    const { user, title } = req.body;
    await this.service.create({ workspaceId: +workspaceId, title }, user);
    res.status(204).end();
  };

  public remove = async (req: Request, res: Response): Promise<void> => {
    const { columnId, workspaceId } = req.params;
    const { user } = req.body;
    await this.service.remove({ id: +columnId, key: +workspaceId }, user);
    res.status(204).end();
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { columnId } = req.params;
    const { user, title } = req.body;
    await this.service.update({ id: +columnId, title }, user);
    res.status(204).end();
  };
}