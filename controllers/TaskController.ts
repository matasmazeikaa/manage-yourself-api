import { Request } from 'express';
import { Controller, Delete, Middleware, Post, Put } from '@overnightjs/core';
import { DB } from '../db/DBController';
import { check, validationResult } from 'express-validator';

@Controller('api/v1/board')
export class TaskController {
  @Post(':id/column/:columnId/task')
  @Middleware([
      check('title', 'Please enter a valid title')
          .not()
          .isEmpty()
          .isLength({ max: 140 }),
      check('id', 'Please enter a valid title')
          .not()
          .isEmpty(),
      check('description', 'Description is missing')
          .not(),
  ])
    async addTaskToColumn (req: Request, res: any): Promise<void> {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { title, description, id } = req.body;

        try {
            const column = await DB.Models.Board.updateOne({ _id: req.params.id }, {
                $push: {
                    tasks: new DB.Models.Task({ columnId: req.params.columnId, title, description, id }),
                },
            });

            res.status(200).json(column);
        } catch (error) {
            res.status(500).json(error);
        }
    }

  @Put(':id/task/:taskId')
  @Middleware([
      check('title', 'Please enter a valid title')
          .not()
          .isEmpty()
          .isLength({ max: 140 }),
      check('description', 'Description is missing')
          .not(),
  ])
  async updateTask (req: Request, res: any): Promise<void> {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          return res.status(400).json({
              errors: errors.array(),
          });
      }

      const { description, title } = req.body;

      try {
          const task = await DB.Models.Board.updateOne({ _id: req.params.id, 'tasks.id': req.params.taskId }, {
              $set: {
                  'tasks.$.title': title,
                  'tasks.$.description': description,
              },
          });

          res.status(200).json(task);
      } catch (error) {
          res.status(500).json(error);
      }
  }

  @Delete(':id/task/:taskId')
  async deleteColumn (req: Request, res: any): Promise<void> {
      try {
          const task = await DB.Models.Board.updateOne(
              { _id: req.params.id },
              {
                  $pull: { tasks: { id: req.params.taskId } },
              }
          );

          res.status(200).json(task);
      } catch (error) {
          res.status(500).json(error);
      }
  }
}
