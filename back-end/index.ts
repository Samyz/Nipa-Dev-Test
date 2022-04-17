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
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET'); //to give access to all the methods provided
    return res.status(200).json({});
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  //   console.log(req);
  try {
    console.log(process.env.DATABASE_URL);
    const client = await db.connect();
    const statusList = await client.query('SELECT status FROM status_list;');
    const result =
      await client.query(`SELECT ticket.ticket_id, ticket.title, ticket.description, ticket.contact, status_list.status, ticket.created_on, ticket.updated_on
  FROM ticket
  LEFT JOIN status_list ON ticket.status = status_list.status_id
  ORDER BY ticket.status;`);

    client.release();
    console.log(process.env.DATABASE_URL);
    return res.status(200).json({
      data: result.rows,
      status: statusList.rows.map((value, index) => {
        return value.status;
      }),
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

app.post('/', async (req: Request, res: Response): Promise<Response> => {
  //   console.log(req);
  try {
    const json = req.body;
    const errList = [undefined, null, ''];
    const client = await db.connect();
    const statusListQuery = await client.query('SELECT * FROM status_list;');
    const statusList = statusListQuery.rows;
    if (
      statusList
        .map((value, index) => {
          return value.status;
        })
        .includes(json.status) &&
      !errList.includes(json.title) &&
      !errList.includes(json.description) &&
      !errList.includes(json.contact)
    ) {
      const result = await client.query(
        `insert into ticket(title, description, contact, status, created_on) values('${
          json.title
        }', '${json.description}', '${json.contact}', ${
          statusList.filter((value, index) => {
            return value.status === json.status;
          })[0].status_id
        }, now());
        SELECT ticket.ticket_id, ticket.title, ticket.description, ticket.contact, status_list.status, ticket.created_on, ticket.updated_on
  FROM ticket
  LEFT JOIN status_list ON ticket.status = status_list.status_id
  ORDER BY ticket.status;`
      );

      client.release();
      console.log(process.env.DATABASE_URL);
      return res.status(200).json({
        data: result.rows,
      });
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

app.put('/', async (req: Request, res: Response): Promise<Response> => {
  //   console.log(req);
  try {
    const json = req.body;
    const errList = [undefined, null, ''];
    const client = await db.connect();
    const statusListQuery = await client.query('SELECT * FROM status_list;');
    const statusList = statusListQuery.rows;
    if (
      statusList
        .map((value, index) => {
          return value.status;
        })
        .includes(json.status) &&
      !errList.includes(json.title) &&
      !errList.includes(json.description) &&
      !errList.includes(json.contact)
    ) {
      const result = await client.query(
        `UPDATE ticket SET title = '${json.title}', description = '${
          json.description
        }', contact = '${json.contact}', status = ${
          statusList.filter((value, index) => {
            return value.status === json.status;
          })[0].status_id
        } WHERE ticket_id = ${json.id};
        SELECT ticket.ticket_id, ticket.title, ticket.description, ticket.contact, status_list.status, ticket.created_on, ticket.updated_on
  FROM ticket
  LEFT JOIN status_list ON ticket.status = status_list.status_id
  ORDER BY ticket.status;`
      );

      client.release();
      console.log(process.env.DATABASE_URL);
      return res.status(200).json({
        data: result.rows,
      });
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

// try {
app.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});
// } catch (error) {
//   console.error(`Error occured: ${error.message}`);
// }
