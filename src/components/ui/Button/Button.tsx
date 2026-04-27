'use client';
import React from 'react';
import Loader from '../Loader';
import Text from '@/components/ui/Text';
import s from './Button.module.scss';
import cn from 'classnames';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
  /** Варианты отображения */
  view: 'dark' | 'light' | 'strong';

  className?: string;
  disabled?: boolean;
  slot?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  loading = false,
  children,
  view,
  className,
  slot,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={cn(s.button, s[`button-${view}`], disabled && s.button_disabled, className)}
      disabled={disabled || loading}
      {...props}
    >
      {slot}
      {loading && <Loader size="s" className={s.button__loader} />}
      <Text color={view === 'dark' ? 'secondary' : 'primary'} tag="span" view="button">
        {children}
      </Text>
    </button>
  );
};

export default Button;
