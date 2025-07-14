const LinkIcon = ({ className = "", size = 30, fill = "currentColor" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={`flex-shrink-0 ${className}`}
            fill="none"
        >
            <path
                id="primary"
                d="M14.5,9.5a3.54,3.54,0,0,1,0,5l-5,5a3.54,3.54,0,0,1-5,0h0a3.54,3.54,0,0,1,0-5"
                style={{
                    stroke: fill,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    fill: "none"
                }}
            />
            <path
                id="primary-2"
                data-name="primary"
                d="M19.5,9.5a3.54,3.54,0,0,0,0-5h0a3.54,3.54,0,0,0-5,0l-5,5a3.54,3.54,0,0,0,0,5h0"
                style={{
                    stroke: fill,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    fill: "none"
                }}
            />
        </svg>
    );
};

export default LinkIcon;
