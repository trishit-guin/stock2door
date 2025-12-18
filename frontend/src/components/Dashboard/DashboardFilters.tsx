"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export function DashboardFilters() {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search operations..." className="pl-8 w-[250px]" />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="receipt">Receipts</SelectItem>
                        <SelectItem value="delivery">Deliveries</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="adjustment">Adjustments</SelectItem>
                    </SelectContent>
                </Select>

                <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
