import React, { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';
import './index.scss';
import axios from './axios';

import TableList from './TableList';
import StatusTabs from './StatusTabs';

const App = () => {
  const [data, setData] = useState([
    {
      ticket_id: 1,
      title: 'test',
      description: 'this is test data',
      contact: '10250',
      status: 'pending',
      created_on: '2022-04-17T13:37:18.362Z',
      updated_on: '2022-04-17T13:37:18.362Z',
    },
    {
      ticket_id: 3,
      title: 'FIFA WORLD CUP',
      description: 'the world biggest football event ever!',
      contact: 'Stamford Bridge',
      status: 'pending',
      created_on: '2022-04-17T14:52:22.187Z',
      updated_on: '2022-04-17T14:52:22.187Z',
    },
  ]);

  const [status, setStatus] = useState([
    'pending',
    'accepted',
    'resolved',
    'rejected',
  ]);

  const queryDB = async () => {
    try {
      let query = await axios.get('/');
      console.log(query.data);
      setStatus(query.data.status);
      setData(query.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    queryDB();
    console.log('eee');
  }, []);
  return (
    <div className='App'>
      hello
      {/* {data.filter((item) => {
        return item.status === 'aaa';
      }).length > 0 ? (
        <TableList
          data={data.filter((item) => {
            return item.status === 'aaa';
          })}
        />
      ) : (
        <div>No content</div>
      )} */}
      <StatusTabs status={status} data={data} />
    </div>
  );
};

export default App;
