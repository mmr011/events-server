import { NextFunction, Router, Response, Request } from 'express';
import { User } from '../shared/models/user.model';
import * as uuid from 'uuid';

// Test data
const testUsers: User[] = [
    {
        email: 'mmr001@gmail.com',
        password: '1234Password',
        userName: 'mmr001',
        userId: uuid.v4()
    }
];

const loginRouter = Router();

// Params middleware
loginRouter.param('userId', (req: Request, res: Response, next: NextFunction, userId: string) => {
    if(!userId || userId === '') {
        res.sendStatus(400);
    };

    const user = testUsers.find(u => u.userId === userId);

    if(user) {
        req['user'] = user; // If the user exists in the list of users, append it to the request
        next();
    } else {
        res.status(404).json({ message: 'User not found'}); // If not, send 404 error message
    }
})

// Test route
loginRouter.get('/', (_, res: Response) => {
    res.status(200).json(testUsers);
});

loginRouter.get('/:userId', (req: Request, res: Response) => {
    const user = req['user'];

    if(!user) {
        res.status(404).json({ message: 'User not found'}); // Further validation of the existance of a user
    } else {
        res.status(200).json({ user: user });
    };
});

// The first step is to create the user
loginRouter.post('/', (req: Request, res: Response) => {
    const { email, password, userName } = req.query && req.query;

    if(!email || !password || !userName) {
        res.status(400).json({ message: 'There cannot be missing data when creating a new user'});
    } else {
        const user: User = {
            email: email as string,
            password: password as string,
            userName: userName as string,
            userId: uuid.v4()
        };

        testUsers.push(user);
        res.status(201).json({ message: 'User added successfully'});
    };
});

export default loginRouter;
