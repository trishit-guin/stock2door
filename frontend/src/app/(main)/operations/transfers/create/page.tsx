import { TransferForm } from "@/components/Operations/TransferForm";

export default function CreateTransferPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Internal Transfer</h1>
                <p className="text-muted-foreground">
                    Move stock between internal locations.
                </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <TransferForm />
            </div>
        </div>
    );
}
