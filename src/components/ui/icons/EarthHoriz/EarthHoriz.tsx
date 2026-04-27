type EarthProps = {
    width?: string;
    className?: string;
}

const EarthIcon: React.FC<EarthProps> = ({width = '100%', className}: EarthProps) => {
    return (
        <svg className={className} width={width} height="100%" viewBox="0 0 1439 656" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_228_14)">
        <path d="M2 764L2 28L178.273 98.7381L355.043 60.9391L707.112 98.5L906.208 78.7586L1087.44 142L1238.18 60.9391L1344.16 98.7381L1439 60.9391V764L1344.16 753.2L1232.44 764L1086.95 694.342L906.208 753.2L778.099 728.901L652.97 764L364.478 694.342L178.273 764L90.3849 728.901L2 764Z" fill="#251810" stroke="black" stroke-width="4"/>
        </g>
        <defs>
        <clipPath id="clip0_228_14">
        <rect width="100%" height="100%" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    );
};

export default EarthIcon;
