import { Controller } from 'react-hook-form';

import { TextFieldWithMessage } from '@react-md/form';

export default function ControllerTextField({
  id,
  message,
  control,
  rules,
  name,
  ...props
}) {
  const { error } = props;
  const messageId = `${id}-message`;
  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      defaultValue=''
      render={({ field }) => (
        <TextFieldWithMessage
          {...field}
          {...props}
          id={id}
          aria-describedby={messageId}
          messageProps={{
            id: messageId,
            error,
            children: message,
          }}
        />
      )}
    />
  );
}
