import React, { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';
import './index.scss';
import axios from './axios';

import TableList from './TableList';
import StatusTabs from './StatusTabs';
import Buttons from './Buttons';
import TicketForm from './TicketForm';

import { Button } from '@react-md/button';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@react-md/dialog';
import { Typography } from '@react-md/typography';
import { useToggle } from '@react-md/utils';

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

  const toLocalTime = (time) => {
    let thisDate = new Date(time);
    return thisDate.toLocaleString();
  };

  const queryDB = async () => {
    try {
      let query = await axios.get('/');
      console.log(query.data);
      setStatus(query.data.status);
      setData(
        query.data.data.map((item) => {
          item.created_on = toLocalTime(item.created_on);
          item.updated_on = toLocalTime(item.updated_on);
          return item;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    queryDB();
  }, []);

  const [visible, enable, disable] = useToggle(false);

  return (
    <div className='App Container'>
      <h2 className='title'>Nipa Dev Interview Test</h2>
      <Buttons
        type='add'
        className='add-button'
        onClick={() => {
          enable();
        }}
      />
      <StatusTabs status={status} data={data} />
      <Dialog
        id='simple-dialog'
        visible={visible}
        onRequestClose={disable}
        aria-labelledby='dialog-title'
      >
        <DialogHeader>
          <DialogTitle id='dialog-title'>Add Ticket</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <TicketForm
            status={status}
            disable={disable}
            setData={setData}
            setStatus={setStatus}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
