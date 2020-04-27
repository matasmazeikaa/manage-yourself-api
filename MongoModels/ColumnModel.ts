import { Schema, model, Document, Model } from 'mongoose';

declare interface IColumn extends Document {
  title: string;
  tasks: [];
  id: string;
  creation_date: Date;
}

export interface ColumnModel extends Model<IColumn> {};

export class Column {
  private readonly _model: Model<IColumn>;

  constructor () {
      const schema = new Schema({
          title: {
              type: String,
              required: true,
          },
          tasks: {
              type: Array,
              required: true,
              default: [],
          },
          id: {
              type: String,
              required: true,
          },
          creation_date: {
              type: Date,
              default: Date.now(),
          },
      });

      this._model = model<IColumn>('column', schema);
  }

  public get model (): Model<IColumn> {
      return this._model;
  }
}
