type EarthLeftProps = {
    height?: string;
    className?: string;
}

const EarthLeftIcon: React.FC<EarthLeftProps> = ({height = '100vh', className}: EarthLeftProps) => {
    return (
        <svg className={className} width="100%" height={height} viewBox="0 0 227 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_223_13)">
        <path d="M-212 -20L227 -20L184.807 116.774L207.353 253.934L173.856 525.556L196.724 681.595L157.108 821.837L207.353 944.741L184.807 1021.41L207.353 1095H-212L-205.558 1021.41L-212 934.724L-170.451 821.837L-205.558 681.595L-191.065 582.193L-212 485.102L-170.451 261.254L-212 116.774L-191.065 48.5798L-212 -20Z" fill="#251810" stroke="black" stroke-width="4"/>
        </g>
        <defs>
        <clipPath id="clip0_223_13">
        <rect width="100%" height="100%" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    );
};

export default EarthLeftIcon;
