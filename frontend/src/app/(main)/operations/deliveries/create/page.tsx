import { DeliveryForm } from "@/components/Operations/DeliveryForm";

export default function CreateDeliveryPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Delivery Order</h1>
                <p className="text-muted-foreground">
                    Send products to a customer.
                </p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <DeliveryForm />
            </div>
        </div>
    );
}
