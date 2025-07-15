const HorizontalBars = ({ className = "", size = 30, fill = "currentColor", strokeWidth }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            stroke={fill}
            strokeWidth={strokeWidth}
            className={`flex-shrink-0 ${className}`}
            fill="none"
        >
            <line x1="21" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
        </svg >
    );
};

export default HorizontalBars;
