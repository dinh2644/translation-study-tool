import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "LiveLingo",
    description: "Live English Translation",
};

export default function PagesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}
