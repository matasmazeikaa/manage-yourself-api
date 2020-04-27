import { Schema, model, Document, Model } from 'mongoose';

declare interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    board_ids: string[];
    creation_date: Date;
}

export interface UserModel extends Model<IUser> {};

export class User {
    private readonly _model: Model<IUser>;

    constructor () {
        const schema = new Schema({
            username: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            board_ids: {
                type: Array,
                required: true,
                default: [],
            },
            creation_date: {
                type: Date,
                default: Date.now(),
            },
        });

        this._model = model<IUser>('user', schema);
    }

    public get model (): Model<IUser> {
        return this._model;
    }
}
