import { connect, connection, Connection } from 'mongoose';
import { User, UserModel } from '../MongoModels/UserModel';
import { Column, ColumnModel } from '../MongoModels/ColumnModel';
import { Board, BoardModel } from '../MongoModels/BoardModel';
import { Task, TaskModel } from '../MongoModels/TaskModel';
import { Comment, CommentModel } from '../MongoModels/CommentModel';
import config from 'config';

declare interface IModels {
    User: UserModel;
    Column: ColumnModel;
    Board: BoardModel;
    Task: TaskModel;
    Comment: CommentModel;
}

export class DB {
    private static instance: DB;

    private _db: Connection;
    private _models: IModels;

    constructor () {
        connect(config.get('mongodb.uri'), { useNewUrlParser: true, useUnifiedTopology: true });

        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        this._models = {
            User: new User().model,
            Board: new Board().model,
            Column: new Column().model,
            Task: new Task().model,
            Comment: new Comment().model,
        };
    }

    public static get Models () {
        if (!DB.instance) {
            DB.instance = new DB();
        }

        return DB.instance._models;
    }

    public connected () {
        console.log('Mongoose has connected');
    }

    error (error) {
        console.log('Mongoose didn\'t connect because', error);
    }
}
