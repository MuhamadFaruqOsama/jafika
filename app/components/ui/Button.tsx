import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "main" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ButtonVariant;
};

export default function Button({
    children,
    variant = "main",
    className = "",
    type = "button",
    ...props
}: ButtonProps) {
    const variantClass = variant === "secondary" ? "secondary-button shadow-3d" : "main-button";
    const combinedClassName = `${variantClass} ${className}`.trim();

    return (
        <button type={type} className={combinedClassName} {...props}>
            {children}
        </button>
    );
}
