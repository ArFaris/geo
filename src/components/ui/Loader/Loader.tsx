import React from 'react';
import cn from 'classnames';
import s from './Loader.module.scss';

export type LoaderProps = {
  /** Размер */
  size?: 's' | 'm' | 'l';
  /** Дополнительный класс */
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({
  size = 'l',
  className,
}) => {
  return (
    <div className={cn(s.loader, s[`loader-${size}`], className)}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`loader__svg loader__svg-${size}`}
        width="100%"
        height="100%"
      >
        <path
          d="M23.3788 34.62C15.3068 36.4835 7.25249 31.4506 5.38894 23.3787C3.52538 15.3068 8.55828 7.25244 16.6302 5.38888C24.7022 3.52533 32.7565 8.55822 34.62 16.6302L39.4919 15.5054C37.0071 4.74282 26.2681 -1.96771 15.5055 0.517031C4.74287 3.00177 -1.96765 13.7409 0.517088 24.5035C3.00183 35.266 13.7409 41.9766 24.5035 39.4918L23.3788 34.62Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default Loader;
