import { ReceiptForm } from "@/components/Operations/ReceiptForm";

export default function CreateReceiptPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Receipt</h1>
                <p className="text-muted-foreground">
                    Receive products from a vendor.
                </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <ReceiptForm />
            </div>
        </div>
    );
}
