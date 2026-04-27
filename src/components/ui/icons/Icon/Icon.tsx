import * as React from 'react';
import s from './icon.module.scss';
import cn from 'classnames';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
  viewBox?: string;
};

const Icon: React.FC<IconProps> = ({
  children,
  width = 24,
  height = 24,
  color,
  className,
  viewBox = `0 0 ${width} ${height}`,
  ...props
}) => {
  return (
        <svg
          data-testid="icon"
          width={width}
          height={height}
          viewBox={viewBox}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(s[`color-${color}`], className)}
          {...props}
        >
          {children}
        </svg>
  );
};

export default Icon;
