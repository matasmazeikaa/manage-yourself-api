import { Request } from 'express';
import { Controller, Middleware, Post } from '@overnightjs/core';
import { DB } from '../db/DBController';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

@Controller('api/v1/user')
export class UserController {
    @Post('register')
    @Middleware([
        check('username', 'Please enter a valid Username')
            .not()
            .isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 6,
        }),
    ])
    async signup (req: Request, res: any): Promise<void> {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { username, email, password } = req.body;

        try {
            let user = await DB.Models.User.findOne({ email });

            if (user) {
                return res.status(400).json({
                    msg: 'User already exists',
                });
            }

            user = new DB.Models.User({ username, email, password });


            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = { user: { id: user.id, username: user.username } };

            jwt.sign(payload, 'access-token', { expiresIn: 10000 },
                (error, token) => {
                    if (error) {
                        throw error;
                    }

                    res.status(200).json({ token });
                }
            );
        } catch (error) {
            res.status(500).send('Unexpected error, please try again!');
        }
    }

    @Post('login')
    @Middleware([
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min: 6,
        }),
    ])
    async login (req: Request, res: any): Promise<void> {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        try {
            const user = await DB.Models.User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'User doesn\'t exist' });
            }

            const isCredentialsMatching = await bcrypt.compare(password, user.password);

            if (!isCredentialsMatching) {
                return res.status(400).json({
                    msg: 'Username or password incorect!',
                });
            }

            const payload = { user: { id: user.id, username: user.username } };

            jwt.sign(payload, 'access-token', { expiresIn: 10000 },
                (error, token) => {
                    if (error) {
                        throw error;
                    }

                    res.status(200).json({
                        token,
                    });
                }
            );
        } catch (error) {
            res.status(500).json({
                msg: `Server error ${error}`,
            });
        }
    }
}
