import Icon from '@/components/ui/icons/Icon';
import { type IconProps } from '@/components/ui/icons/Icon';
import React from 'react';

const EmailIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    color = 'primary',
    ...props
}: IconProps) => {
    return (
        <Icon width={width} height={height} color={color} viewBox='0 0 24 24' {...props}>
            <path d="M19 4H5C3.34315 4 2 5.34315 2 7V17C2 18.6569 3.34315 20 5 20H19C20.6569 20 22 18.6569 22 17V7C22 5.34315 20.6569 4 19 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Icon>
    );
};

export default EmailIcon;
