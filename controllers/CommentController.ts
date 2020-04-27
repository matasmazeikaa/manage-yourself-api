import { Controller, Post } from '@overnightjs/core';
import { DB } from '../db/DBController';

@Controller('api/v1/board')
export class CommentController {
  @Post(':id/task/:taskId/comments')
    async addComment (req: any, res: any): Promise<void> {
        const { id, taskId } = req.params;
        const { description } = req.body;

        try {
            const comment = await new DB.Models.Comment({ description, user: req.user.user.username });
            await DB.Models.Board.updateOne({ _id: id, 'tasks.id': taskId }, {
                $push: {
                    'tasks.$.comments': comment,
                },
            });

            res.status(200).json(comment);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
