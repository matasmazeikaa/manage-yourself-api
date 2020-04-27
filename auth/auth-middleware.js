import jwt from 'jsonwebtoken';

const unauthorizedEndpoints = ['/api/v1/user/register', '/api/v1/user/login'];

export const authenticateJWT = (req, res, next) => {
    const isUnauthorizedEndpoint = unauthorizedEndpoints.some((url) => url === req.originalUrl);

    if (isUnauthorizedEndpoint) {
        next();

        return;
    }

    const authToken = req.headers.authorization;

    if (authToken) {
        try {
            const verified = jwt.verify(authToken, 'access-token');

            req.user = verified;
            next();
        } catch (error) {
            return res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};
