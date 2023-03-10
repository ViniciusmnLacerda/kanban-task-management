import sequelize from '../database/models';
import cardsModel from '../database/models/Cards';
import cardsColumnModel from '../database/models/CardsColumn';
import { ICard, IToken } from '../interfaces';
import { ErrorClient } from '../utils';
import { INewCard, IRemove, IService, IUpdate } from './interfaces';

export default class CardsService implements IService<ICard[], INewCard> {
  public getter = async (columnId: number, _user: IToken): Promise<ICard[]> => {
    const cards = await cardsColumnModel.findAll({
      where: { columnId },
      attributes: ['position', 'columnId'],
      include: {
        model: cardsModel,
        as: 'card',
        attributes: [['id', 'cardId'], 'title', 'content'],
      },
    }) as unknown as ICard[];
    return cards.sort((a, b) => a.position - b.position);
  };

  public create = async ({ columnId, title, content }: INewCard, user: IToken): Promise<void> => {
    const cards = await this.getter(columnId, user);
    try {
      await sequelize.transaction(async (t) => {
        const { id: cardId } = await cardsModel.create({ title, content }, { transaction: t });
        await cardsColumnModel.create(
          { cardId, columnId, position: cards.length }, 
          { transaction: t },
          );
      });
    } catch (err) {
      throw new ErrorClient(500, 'Internal server error');
    }
  };

  public remove = async (
    { id: cardId, key: columnId }: Omit<IRemove, 'email'>,
    _user: IToken,
): Promise<void> => {
  try {
    await sequelize.transaction(async (t) => {
      await cardsColumnModel.destroy({ where: { cardId, columnId }, transaction: t });
      await cardsModel.destroy({ where: { id: cardId }, transaction: t });
    });
  } catch (err) {
    throw new ErrorClient(500, 'Internal server error');
  }
  };

  public update = async (
    { id, title, content }: Omit<IUpdate, 'key'>,
    _user: IToken,
  ): Promise<void> => {
    await cardsModel.update({ title, content }, { where: { id } });
  };
}