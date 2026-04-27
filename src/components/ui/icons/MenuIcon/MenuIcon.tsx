import Icon from '@/components/ui/icons/Icon';
import { type IconProps } from '@/components/ui/icons/Icon';
import React from 'react';

const MenuIcon: React.FC<IconProps> = ({
    width = 30,
    height = 30,
    color = 'secondary',
    ...props
}: IconProps) => {
    return (
        <Icon width={width} height={height} color={color} {...props} viewBox="0 0 24 24">
            <line x1="21" x2="3" y1="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" x2="3" y1="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" x2="3" y1="6" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Icon>
    );
};

export default MenuIcon;
