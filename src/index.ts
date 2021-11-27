import express, { Request, Response } from 'express';

const PORT: string = '3001';
const app: express.Application = express();


app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'hello world'});
});

app.listen(PORT, (): void => {
    console.log(`Server running in PORT: ${PORT}`);
});
