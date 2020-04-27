import * as bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from '@overnightjs/core';
import { authenticateJWT } from './auth/auth-middleware';
import { UserController } from './controllers/UserController';
import { BoardController } from './controllers/BoardController';
import { CommentController } from './controllers/CommentController';
import { ColumnController } from './controllers/ColumnController';
import { TaskController } from './controllers/TaskController';

export class ExpressServer extends Server {
	port = 3001;
	constructor () {
	    super();
	    this.setupExpress();
	    this.setupControllers();
	}

	private setupExpress (): void {
	    // Setup express here like you would
	    // any other ExpressJS application.
	    this.app.use(bodyParser.json());
	    this.app.use(cors());
	    this.app.use(bodyParser.urlencoded({ extended: true }));
	    this.app.use(authenticateJWT);
	}

	private setupControllers () {
	    const userController = new UserController();
	    const boardController = new BoardController();
	    const commentController = new CommentController();
	    const columnController = new ColumnController();
	    const taskController = new TaskController();

	    super.addControllers([boardController, userController, commentController, columnController, taskController]);
	}

	public start (): void {
	    this.app.listen(this.port, () => {
	        console.log(`Server listening on port:${this.port}`);
	    });
	}
}

const server = new ExpressServer();

server.start();

export default ExpressServer;
