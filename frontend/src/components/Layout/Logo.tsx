import Image from "next/image";

interface LogoProps {
    size?: number;
    showText?: boolean;
    className?: string;
}

export function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Image
                src="/stock2door-logo.svg"
                alt="Stock2Door Logo"
                width={size}
                height={size}
                className="object-contain"
                priority
                unoptimized
            />
            {showText && (
                <div className="flex flex-col">
                    <span className="text-xl font-bold">
                        <span className="text-[#2E4A6B]">Stock</span>
                        <span className="text-[#76A854]">2Door</span>
                    </span>
                    <span className="text-xs text-muted-foreground">Smart, Green Logistics</span>
                </div>
            )}
        </div>
    );
}
