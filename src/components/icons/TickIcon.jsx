const TickIcon = ({ className = "", size = 30, fill = "currentColor", ...props }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={`flex-shrink-0 ${className}`}
            fill="none"
            {...props}
        >
            <polyline
                points="3.7 14.3 9.6 19 20.3 5"
                stroke={fill}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default TickIcon;
