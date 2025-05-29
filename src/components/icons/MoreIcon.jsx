
const MoreIcon = ({ className, size = 30, stroke = "currentColor", ...props }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <rect width="24" height="24" fill="none" />
            <circle
                cx="12"
                cy="7"
                r="0.5"
                transform="rotate(90 12 7)"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="12"
                r="0.5"
                transform="rotate(90 12 12)"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="17"
                r="0.5"
                transform="rotate(90 12 17)"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default MoreIcon;
