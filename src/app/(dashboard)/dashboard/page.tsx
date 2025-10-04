
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
    const [response, setResponse] = useState<string>("");

    const callBackend = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/hello", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: "Hello from frontend" }),
            });

            if (!res.ok) throw new Error("Backend error");
            const data = await res.json();
            setResponse(JSON.stringify(data))
        } catch (err) {
            console.error(err);
            setResponse("Error contacting backend");
        }
    }

    return (
        <main className="flex flex-row min-h-screen">
            {/* 75% width of the page view */}
            <div className="w-3/4 h-full flex justify-center items-center border-r">
                <h1>Content space</h1>
            </div>
            {/* 25% width of the page view */}
            <div className="w-1/4 h-full flex flex-col">
                {/* Top 50% height */}
                <div className="h-1/2 flex justify-center items-center border-b bg-blue-100">
                    <h1 className="text-blue-700">Zusia</h1>
                </div>
                {/* Bottom 50% height */}
                <div className="h-1/2 flex justify-center items-center bg-green-100">
                    <h1 className="text-green-700">Chat</h1>
                </div>
            </div>
        </main>
    );
}