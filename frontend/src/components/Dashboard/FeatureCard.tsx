import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    color?: string;
}

export function FeatureCard({ title, description, icon: Icon, color = "text-primary" }: FeatureCardProps) {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md h-full">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-4 h-full">
                <div className={`mb-2 ${color}`}>
                    <Icon className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
