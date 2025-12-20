"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Move {
    _id: string;
    type: string;
    status: string;
    date: string;
    sourceLocation?: { name: string };
    destinationLocation?: { name: string };
    partnerName?: string;
}

export default function MoveHistoryPage() {
    const [moves, setMoves] = useState<Move[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMoves() {
            try {
                const response = await api.axiosInstance.get('/api/v1/stock-movements');
                if (response.data) {
                    setMoves(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch moves:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMoves();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading moves...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Move History</h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {moves.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No moves found
                                </TableCell>
                            </TableRow>
                        ) : (
                            moves.map((move) => (
                                <TableRow key={move._id}>
                                    <TableCell className="font-medium text-xs font-mono">
                                        {move._id.slice(-6).toUpperCase()}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <Badge variant="outline">{move.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {move.sourceLocation?.name || move.partnerName || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {move.destinationLocation?.name || move.partnerName || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {move.date ? new Date(move.date).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                move.status === "done"
                                                    ? "default"
                                                    : move.status === "waiting"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                            className={
                                                move.status === "done" ? "bg-green-600 hover:bg-green-700" : ""
                                            }
                                        >
                                            {move.status.charAt(0).toUpperCase() + move.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
