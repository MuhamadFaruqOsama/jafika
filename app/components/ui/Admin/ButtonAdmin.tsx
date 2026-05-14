type ButtonAdminProps = {
    children: React.ReactNode;
}

export function ButtonAdmin({
    children
}: ButtonAdminProps) {
    return (
        <button
            className="flex items-center gap-2 py-2 px-5 bg-pink-500 text-white rounded-lg cursor-pointer hover:bg-pink-600 transition-all duration-300 font-medium text-sm"
        >
            {children}
        </button>
    )
}