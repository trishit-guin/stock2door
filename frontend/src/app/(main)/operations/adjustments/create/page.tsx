import { AdjustmentForm } from "@/components/Operations/AdjustmentForm";

export default function CreateAdjustmentPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Stock Adjustment</h1>
                <p className="text-muted-foreground">
                    Correct stock levels based on physical count.
                </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <AdjustmentForm />
            </div>
        </div>
    );
}
