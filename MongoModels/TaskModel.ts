import { Schema, model, Document, Model } from 'mongoose';

declare interface ITask extends Document {
  title: string;
  description: string;
  id: string;
  creation_date: Date;
}

export interface TaskModel extends Model<ITask> {};

export class Task {
  private readonly _model: Model<ITask>;

  constructor () {
      const schema = new Schema({
          title: {
              type: String,
              required: true,
          },
          description: {
              type: String,
              required: true,
              default: '',
          },
          columnId: {
              type: String,
              required: true,
          },
          comments: {
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

      this._model = model<ITask>('task', schema);
  }

  public get model (): Model<ITask> {
      return this._model;
  }
}
