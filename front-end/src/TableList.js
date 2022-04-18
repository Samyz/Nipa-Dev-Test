import React, { useState } from 'react';
import { upperFirst } from 'lodash';

import {
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@react-md/table';
import Buttons from './Buttons';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@react-md/dialog';
import { useToggle } from '@react-md/utils';
import TicketForm from './TicketForm';

export default function TableList(props) {
  const columns = Object.keys(props.data[0]);
  /**
   * A custom sort function for the list of desserts.
   */
  const sort = (key, ascending) => {
    console.log(props.data);
    const sorted = props.data.slice();
    console.log(sorted);
    sorted.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      const value =
        typeof aValue === 'number'
          ? aValue - bValue
          : aValue.localeCompare(bValue);

      return value * (ascending ? 1 : -1);
    });

    return sorted;
  };

  const [state, setState] = useState(() => ({
    data: sort('title', true),
    sortKey: 'title',
    sortOrder: 'ascending',
  }));

  React.useEffect(() => {
    setState({
      data: sort('title', true),
      sortKey: 'title',
      sortOrder: 'ascending',
    });
  }, [props.data]);

  const update = (sortKey) => {
    setState((prevState) => {
      const prevSortKey = prevState.sortKey;
      const prevSortOrder = prevState.sortOrder;

      let sortOrder;
      if (sortKey === prevSortKey) {
        // it's the same column, so toggle the sort order
        sortOrder = prevSortOrder === 'ascending' ? 'descending' : 'ascending';
      } else {
        // it's a new column to sort by, so default to ascending for the name column
        // but descending for all the rest.
        sortOrder = sortKey === 'title' ? 'ascending' : 'descending';
      }

      return {
        data: sort(sortKey, sortOrder === 'ascending'),
        sortKey,
        sortOrder,
      };
    });
  };

  const { data, sortKey, sortOrder } = state;

  const [visible, enable, disable] = useToggle(false);

  const [pressData, setPressData] = useState(null);

  return (
    <>
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
            data={pressData}
            status={props.status}
            disable={disable}
            setData={props.setData}
            setStatus={props.setStatus}
          />
        </DialogContent>
      </Dialog>
      <TableContainer>
        <Table fullWidth>
          <TableHeader>
            <TableRow>
              {columns.map((name) => {
                return name !== 'ticket_id' ? (
                  <TableCell
                    key={name}
                    aria-sort={name === sortKey ? sortOrder : 'none'}
                    onClick={() => update(name)}
                  >
                    {upperFirst(name)}
                  </TableCell>
                ) : (
                  ''
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.title}>
                {columns.map((key) => {
                  return key !== 'ticket_id' ? (
                    <TableCell
                      key={key}
                      // grow={key === 'title'}
                      hAlign={
                        typeof item[key] === 'number' ? 'right' : undefined
                      }
                    >
                      {item[key]}
                    </TableCell>
                  ) : (
                    ''
                  );
                })}
                <TableCell>
                  <Buttons
                    type='edit'
                    onClick={() => {
                      setPressData(item);
                      enable();
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
