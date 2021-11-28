import express, { Application, Response } from 'express';
import  loginRouter  from  './routes/login';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const PORT: string = '3001';
const app: Application = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/login', loginRouter);

app.get('/', (_, res: Response) => {
    res.json({ message: 'hello world'});
});

app.listen(PORT, (): void => {
    console.log(`Server running in PORT: ${PORT}`);
});
