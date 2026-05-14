export function AdminHeader({ title }: { title: string }) {
    return (
        <h1 className="text-gray-700 flex items-center gap-3 capitalize">
            {title}
        </h1>
    )
}