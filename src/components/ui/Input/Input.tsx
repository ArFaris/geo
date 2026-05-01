'use client';
import React, { useState } from 'react';
import cn from 'classnames';
import s from './Input.module.scss';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value?: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange?: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;

  error?: boolean;

  editmode?: boolean;

  theme?: 'light' | 'dark';
};

const Input: React.FC<InputProps> = ({
  value: externalValue, 
  onChange: externalOnChange, 
  afterSlot, 
  className, 
  error,
  placeholder,
  editmode,
  theme = 'dark',
  ...props}) =>
{
  const [internalValue, setInternalValue] = useState('');

  const isControlled = externalValue !== undefined;
  const currentValue = isControlled ? externalValue : internalValue;

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = event.target.value;
      
      if (!isControlled) {
        setInternalValue(newValue);
      }
      
      if (externalOnChange) {
        externalOnChange(newValue);
      }
    },
    [isControlled, externalOnChange]
  ); 

  return (
    <div className={cn(s.input, className, error && s.error, editmode && s.editmode, theme === 'light' && s.light)}>
      <input type="text" value={externalValue} {...props} placeholder={placeholder || 'Текст'} onChange={handleChange}/>
      <div className={s.input__after}>
        {afterSlot}
      </div>
    </div>
  );
};

export default Input;
