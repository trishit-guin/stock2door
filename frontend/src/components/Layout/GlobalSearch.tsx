"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Package, MapPin, Warehouse, FileText, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
    id: string;
    type: "product" | "warehouse" | "location" | "operation";
    title: string;
    subtitle: string;
    url: string;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcut: Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Search API call
    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const debounceSearch = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceSearch);
    }, [query]);

    const getIcon = (type: string) => {
        switch (type) {
            case "product":
                return <Package className="h-4 w-4 text-purple-600" />;
            case "warehouse":
                return <Warehouse className="h-4 w-4 text-blue-600" />;
            case "location":
                return <MapPin className="h-4 w-4 text-green-600" />;
            case "operation":
                return <FileText className="h-4 w-4 text-amber-600" />;
            default:
                return <Search className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "product":
                return "bg-purple-100 text-purple-700";
            case "warehouse":
                return "bg-blue-100 text-blue-700";
            case "location":
                return "bg-green-100 text-green-700";
            case "operation":
                return "bg-amber-100 text-amber-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <>
            {/* Search Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-64"
            >
                <Search className="h-4 w-4" />
                <span>Search...</span>
                <kbd className="ml-auto text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-300">
                    ⌘K
                </kbd>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
                    <div
                        ref={searchRef}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b">
                            <Search className="h-5 w-5 text-gray-400" />
                            <Input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, warehouses, operations..."
                                className="flex-1 border-none focus-visible:ring-0 text-lg"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            )}
                        </div>

                        {/* Search Results */}
                        <div className="max-h-[500px] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Searching...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((result) => (
                                        <Link
                                            key={result.id}
                                            href={result.url}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setQuery("");
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="shrink-0">
                                                {getIcon(result.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {result.title}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {result.subtitle}
                                                </p>
                                            </div>
                                            <Badge className={getTypeColor(result.type)}>
                                                {result.type}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            ) : query.length >= 2 ? (
                                <div className="p-8 text-center">
                                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">No results found for "{query}"</p>
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">Start typing to search...</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Search across products, warehouses, and operations
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex gap-4">
                                <span>↑↓ Navigate</span>
                                <span>↵ Select</span>
                                <span>Esc Close</span>
                            </div>
                            <span>Ctrl+K to open</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
