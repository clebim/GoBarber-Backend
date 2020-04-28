import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';

import routes from './routes';
import './database';

const app = express();

mongoose.connect(
    'mongodb://localhost:27017/gobarber',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
    }
);

app.use(express.json());
app.use(cors());
app.use('/files', express.static(path.resolve(__dirname, '..','tmp','uploads')));
app.use(routes);


export default app;
