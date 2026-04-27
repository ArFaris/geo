import Icon from '@/components/ui/icons/Icon';
import { type IconProps } from '@/components/ui/icons/Icon';
import React from 'react';

const CloseIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    ...props
}: IconProps) => {
    return (
        <Icon width={width} height={height} {...props}>
            <path d="M20 20L4 4.00003M20 4L4.00002 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </Icon>
    );
};

export default CloseIcon;
