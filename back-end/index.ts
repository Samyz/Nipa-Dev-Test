import express, { Application, Request, Response, NextFunction } from 'express';

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
  return res.status(200).send({
    message: 'Hello World!',
  });
});

// try {
app.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});
// } catch (error) {
//   console.error(`Error occured: ${error.message}`);
// }
