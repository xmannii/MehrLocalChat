import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import { AppSidebar } from "@/components/AppSidebar";
import { Providers } from "@/components/providers";
export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <Providers>
      <div className="flex h-screen flex-col ">
        <div className="z-50 flex-none">
          <DragWindowRegion title="Mehr - Local Chatbot" />
      </div>
      <div className="flex flex-1 overflow-hidden bg-background/90">
        <main className="relative flex-1 overflow-auto ">
          <div className="mx-auto h-full max-w-4xl p-4">
            {children}
          </div>
        </main>
        <AppSidebar />
      </div>
    </div>
    </Providers>
  );
}
