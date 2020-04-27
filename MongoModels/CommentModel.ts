import { Schema, model, Document, Model } from 'mongoose';

declare interface IComment extends Document {
  title: string;
  tasks: [];
  id: string;
  creation_date: Date;
}

export interface CommentModel extends Model<IComment> {};

export class Comment {
  private readonly _model: Model<IComment>;

  constructor () {
      const schema = new Schema({
          description: {
              type: String,
              required: true,
          },
          user: {
              type: Array,
              required: true,
          },
          creation_date: {
              type: Date,
              required: true,
              default: Date.now(),
          },
      });

      this._model = model<IComment>('comments', schema);
  }

  public get model (): Model<IComment> {
      return this._model;
  }
}
