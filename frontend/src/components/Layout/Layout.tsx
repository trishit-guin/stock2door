"use client";

import { Sidebar } from "./Sidebar";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDialog } from "./ProfileDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();
    
    const handleLogout = () => {
        try {
            // Remove token from localStorage
            localStorage.removeItem('smartroute_token');
            
            // Success message with styling
            console.log(
                '%c👋 Logout Successful!',
                'color: #ef4444; font-size: 16px; font-weight: bold; padding: 8px; background: #fef2f2; border-radius: 4px;'
            );
            console.log(
                '%c✨ See you soon!',
                'color: #f59e0b; font-size: 14px; padding: 4px;'
            );
            
            // Redirect to login page
            router.push('/login');
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
