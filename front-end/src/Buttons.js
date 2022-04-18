import { Button } from '@react-md/button';
import { FontIcon, TextIconSpacing } from '@react-md/icon';

export default function Buttons(props) {
  return (
    <Button
      id='icon-button-11'
      //   buttonType='icon'
      theme='clear'
      themeType='outline'
      className={props.className}
      aria-label={props.type}
    >
      <TextIconSpacing icon={<FontIcon>{props.type}</FontIcon>}>
        {props.type}
      </TextIconSpacing>
    </Button>
  );
}
