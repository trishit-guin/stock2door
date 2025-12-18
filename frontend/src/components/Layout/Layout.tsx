"use client";

import { Sidebar } from "./Sidebar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDialog } from "./ProfileDialog";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (response.ok) {
                // Redirect to landing page after successful logout
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar onProfileClick={() => setIsProfileOpen(true)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex h-16 items-center justify-end px-8 bg-card">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>

                <ProfileDialog
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                />
            </div>
        </div>
    );
}
