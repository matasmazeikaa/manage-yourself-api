import { Request } from 'express';
import { Controller, Middleware, Get, Post, Delete } from '@overnightjs/core';
import { DB } from '../db/DBController';
import { check, validationResult } from 'express-validator';

@Controller('api/v1/board')
export class BoardController {
	@Get(':id')
    async getBoard (req: Request, res: any): Promise<void> {
        try {
            const board = await DB.Models.Board.findOne({ _id: req.params.id });

            res.status(200).json(board);
        } catch (error) {
            res.status(500).json(error);
        }
    }

  @Get()
	async getBoards (req: any, res: any): Promise<void> {
	    try {
	    		console.log(req.user.user);
	        const board = await DB.Models.User.find({ _id: req.user.user.id });
	        const promiseWrapper = [];
	        board[0].board_ids.forEach((boardId) => {
	        		const board = DB.Models.Board.findOne({ _id: boardId });

	            // @ts-ignore
	            promiseWrapper.push(board);
	        });

	        const boards = await Promise.all(promiseWrapper);

	        res.status(200).json(boards);
	    } catch (error) {
	        res.status(500).json(error);
	    }
	}

	@Post()
	@Middleware([
	    check('title', 'Please enter a valid title')
	        .not()
	        .isEmpty()
	        .isLength({ max: 140 }),
	    check('theme', 'Please enter a valid title')
	        .not()
	        .isEmpty(),
	])
  async addBoard (req: any, res: any): Promise<void> {
	    const errors = validationResult(req);

	    if (!errors.isEmpty()) {
	        return res.status(400).json({
	            errors: errors.array(),
	        });
	    }

	    const { title, theme } = req.body;

	    try {
	        const board = await new DB.Models.Board({ title, theme });
	        await DB.Models.User.updateOne({ _id: req.user.user.id }, {
	        	$push: {
	        		board_ids: board._id,
	            },
	        });

	        await board.save();

	        res.status(200).json(board);
	    } catch (error) {
	        res.status(500).json({ errors: `Something went wrong, please try again: ${error}` });
	    }
  }

  @Delete(':id')
	async deleteBoard (req: Request, res: any): Promise<void> {
	    try {
	        const board = await DB.Models.Board.deleteOne(
	            { _id: req.params.id }
	        );

	        res.status(200).json(board);
	    } catch (error) {
	        res.status(500).json(error);
	    }
	}

	@Post(':id/sort')
  async onSort (req: Request, res: any): Promise<void> {
	    const { columns } = req.body;
	    const tasks = [];
	    // @ts-ignore
	    columns.forEach((column) => {
	        // @ts-ignore
	        column.tasks.forEach((task) => tasks.push(task));
	    });

	    console.log(tasks);

	    columns.forEach((column) => {
	        column.tasks = [];
	    });

	    try {
	        const board = await DB.Models.Board.updateOne({ _id: req.params.id }, {
	            $set: {
	                columns,
	                tasks,
	            },
	        });

	        res.status(200).json(board);
	    } catch (error) {
	        res.status(500).json(error);
	    }
  }
}
