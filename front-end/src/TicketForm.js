import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@react-md/button';
import { DialogFooter } from '@react-md/dialog';
import {
  Checkbox,
  Fieldset,
  Form,
  FormMessage,
  Radio,
  Select,
  Switch,
} from '@react-md/form';
import { CircularProgress } from '@react-md/progress';
import { useTimeout } from '@react-md/utils';

import axios from './axios';

// import CodeBlock from './CodeBlock';

import ControllerTextField from './ControllerTextField';

// const statusList = ['Mr', 'Mrs', 'Miss', 'Dr', 'Other'];
export default function TicketForm(props) {
  const statusList = props.status;
  const {
    control,
    reset,
    handleSubmit,
    formState: {
      errors: { title, description, contact, status },
    },
  } = useForm({ mode: 'onChange' });

  const toLocalTime = (time) => {
    let thisDate = new Date(time);
    return thisDate.toLocaleString();
  };

  React.useEffect(() => {
    console.log(props.data);
    if (props.data) {
      reset({
        title: props.data.title,
        description: props.data.description,
        contact: props.data.contact,
        status: props.data.status,
      });
      //   setState({ data: props.data });
    }
  }, []);

  return (
    <>
      <Form
        onReset={() => {
          reset({
            title: '',
            description: '',
            contact: '',
            status: '',
          });
          props.disable();
        }}
        onSubmit={handleSubmit(async (data) => {
          console.log(data);
          if (props.data === null || props.data === undefined) {
            try {
              let query = await axios.post('/', data);
              console.log(query);
              props.setStatus(query.data.status);
              props.setData(
                query.data.data.map((item) => {
                  item.created_on = toLocalTime(item.created_on);
                  item.updated_on = toLocalTime(item.updated_on);
                  return item;
                })
              );
              props.disable();
            } catch (err) {
              console.log(err);
            }
          } else {
            console.log(props.data);
            try {
              let query = await axios.put('/', {
                ...data,
                id: parseInt(props.data.ticket_id),
              });
              console.log(query);
              props.setStatus(query.data.status);
              props.setData(
                query.data.data.map((item) => {
                  item.created_on = toLocalTime(item.created_on);
                  item.updated_on = toLocalTime(item.updated_on);
                  return item;
                })
              );
              props.disable();
            } catch (err) {
              console.log(err);
            }
          }
        })}
      >
        <ControllerTextField
          id='rhf-title'
          name='title'
          label='Title'
          placeholder='Title'
          control={control}
          rules={{
            required: 'Required',
            minLength: {
              value: 1,
              message: 'At least 1 characters',
            },
            maxLength: {
              value: 100,
              message: 'Max length is 100',
            },
          }}
          error={!!title}
          message={title?.message}
        />
        <ControllerTextField
          id='rhf-description'
          name='description'
          label='Description'
          placeholder='Description'
          control={control}
          rules={{
            required: 'Required',
            minLength: {
              value: 1,
              message: 'Min length is 1',
            },
          }}
          error={!!description}
          message={description?.message}
        />
        <ControllerTextField
          control={control}
          id='rhf-contact'
          name='contact'
          type='tel'
          label='Contact'
          placeholder='Contact'
          rules={{
            required: 'Required',
            minLength: {
              value: 1,
              message: 'At least 1 characters',
            },
            maxLength: {
              value: 255,
              message: 'No more than 255 characters',
            },
          }}
          error={!!contact}
          message={contact?.message}
        />
        <Controller
          control={control}
          name='status'
          defaultValue=''
          rules={{ required: 'Cannot be blank' }}
          render={({ field }) => (
            <Select
              {...field}
              id='rhf-status'
              aria-describedby='rhf-title-error'
              label='Status'
              placeholder='Status'
              options={statusList}
              error={!!status}
            />
          )}
        />
        <FormMessage id='rh-status-error' error>
          {status?.message}
        </FormMessage>
        <DialogFooter align='end'>
          <Button
            id='rhf-reset'
            type='reset'
            theme='secondary'
            themeType='outline'
          >
            Cancel
          </Button>
          <Button
            id='rhf-submit'
            type={'submit'}
            theme={'primary'}
            themeType='outline'
          >
            Submit
          </Button>
        </DialogFooter>
      </Form>
    </>
  );
}
