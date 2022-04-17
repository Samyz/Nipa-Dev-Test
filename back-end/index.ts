import express, { Application, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app: Application = express();
const port = process.env.PORT || 8000;

// Body parsing Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Option'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PATCH, GET'); //to give access to all the methods provided
    return res.status(200).json({});
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  //   console.log(req);
  console.log(process.env.DATABASE_URL);
  const client = await db.connect();
  const result = await client.query('SELECT * FROM ticket');

  client.release();
  console.log(process.env.DATABASE_URL);
  return res.status(200).json({
    data: result,
  });
  //   return res.status(200).send({
  //     message: 'Hello World!',
  //   });
});

// try {
app.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});
// } catch (error) {
//   console.error(`Error occured: ${error.message}`);
// }
