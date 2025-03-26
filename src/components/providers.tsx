import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </TooltipProvider>
    )
}
