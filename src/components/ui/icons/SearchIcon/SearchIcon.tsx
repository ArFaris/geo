import Icon from '@/components/ui/icons/Icon';
import { type IconProps } from '@/components/ui/icons/Icon';
import React from 'react';

const SearchIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    color = 'accent',
    ...props
}: IconProps) => {
    return (
        <Icon width={width} height={height} color={color} {...props}>
            <path d="M15.5 15.5L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M10 16C13.3137 16 16 13.3137 16 10C16 6.68629 13.3137 4 10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16Z" stroke="currentColor" stroke-width="2"/>
        </Icon>
    );
};

export default SearchIcon;
