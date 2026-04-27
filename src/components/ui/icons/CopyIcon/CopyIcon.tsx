import Icon from '@/components/ui/icons/Icon';
import { type IconProps } from '@/components/ui/icons/Icon';
import React from 'react';

const CopyIcon: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    color = 'primary',
    ...props
}: IconProps) => {
    return (
        <Icon width={width} height={height} viewBox='0 0 24 24' color={color} {...props}>
            <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke='currentColor' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14.0002 11C13.5707 10.4259 13.0228 9.95081 12.3936 9.60702C11.7645 9.26323 11.0687 9.05881 10.3535 9.00763C9.63844 8.95645 8.92059 9.05962 8.24887 9.31018C7.57715 9.56074 6.96713 9.95292 6.46022 10.46L3.46022 13.46C2.54941 14.403 2.04543 15.666 2.05683 16.977C2.06823 18.288 2.59407 19.5421 3.52111 20.4691C4.44815 21.3962 5.70222 21.922 7.0132 21.9334C8.32418 21.9448 9.58719 21.4408 10.5302 20.53L12.2402 18.82" stroke='currentColor' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Icon>
    );
};

export default CopyIcon;
