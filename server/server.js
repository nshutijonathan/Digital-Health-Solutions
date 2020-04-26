import '@babel/polyfill/noConflict';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/routes';
import {demoLogger} from './middlewares/demo.logger';
// creating app instance
const app = express();
// body-parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.options('*', cors());
app.use(cors());
app.use(demoLogger);
app.use(router);
// app.use(method);
dotenv.config();
// home route
app.get('/', (req, res) => res.status(200).send({
  status: 200,
  message: 'Welcome to Digital Health Solutions'
}));
// process environment
const port = process.env.PORT || 5000;
app.listen(port, console.log(`app is listening on port ${port}`));
export default app;
