type ButtonAdminProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
}

export function ButtonAdmin({
    children,
    type = "button",
    disabled = false,
    onClick,
}: ButtonAdminProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className="flex items-center gap-2 py-2 px-5 bg-pink-500 text-white rounded-md cursor-pointer hover:bg-pink-600 transition-all duration-300 font-medium text-sm"
        >
            {children}
        </button>
    )
}
