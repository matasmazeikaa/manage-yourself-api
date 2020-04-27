import { Schema, model, Document, Model } from 'mongoose';

declare interface IBoard extends Document {
	title: string;
	columns: string;
	theme: string;
	creation_date: Date;
}

export interface BoardModel extends Model<IBoard> {}

export class Board {
	private readonly _model: Model<IBoard>;

	constructor () {
	    const schema = new Schema({
	        title: {
	            type: String,
	            required: true,
	        },
	        theme: {
	        	type: String,
	          required: true,
	        },
	        columns: {
	            type: Array,
	            required: true,
	            default: [],
	        },
	        tasks: {
	            type: Array,
	            required: true,
	            default: [],
	        },
	    });

	    this._model = model<IBoard>('board', schema);
	}

	public get model (): Model<IBoard> {
	    return this._model;
	}
}
