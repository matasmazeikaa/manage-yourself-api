import { Request } from 'express';
import { Controller, Middleware, Post, Delete, Put } from '@overnightjs/core';
import { DB } from '../db/DBController';
import { check, validationResult } from 'express-validator';

@Controller('api/v1/board')
export class ColumnController {
  @Put(':id/column/:columnId')
  @Middleware([
      check().not()
          .isEmpty(),
  ])
    async editColumnTitle (req: Request, res: any): Promise<void> {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        try {
            const column = await DB.Models.Board.updateOne({ _id: req.params.id, 'columns.id': req.params.columnId }, {
                $set: {
                    'columns.$.title': req.body.title,
                },
            });

            res.status(200).json(column);
        } catch (error) {
            res.status(500).json(error);
        }
    }

  @Post(':id/column')
  @Middleware([
      check('title', 'Please enter a valid title')
          .not()
          .isEmpty()
          .isLength({ max: 140 }),
      check('id', 'Please enter a valid title')
          .not()
          .isEmpty(),

      check('tasks', 'Please enter a valid task').not(),
  ])
  async addColumn (req: Request, res: any): Promise<void> {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          return res.status(400).json({
              errors: errors.array(),
          });
      }

      const { title, id } = req.body;

      try {
          const column = await DB.Models.Board.updateOne(
              { _id: req.params.id },
              {
                  $push: {
                      columns: new DB.Models.Column({ title, id }),
                  },
              }
          );

          res.status(200).json(column);
      } catch (error) {
          res.status(500).json(error);
      }
  }

  @Delete(':id/column/:columnId')
  async deleteColumn (req: Request, res: any): Promise<void> {
      try {
          const column = await DB.Models.Board.updateOne(
              { _id: req.params.id },
              {
                  $pull: { columns: { id: req.params.columnId } },
              }
          );

          res.status(200).json(column);
      } catch (error) {
          res.status(500).json(error);
      }
  }
}
