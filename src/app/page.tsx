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
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Next.js + shadcn Test</h1>
      <Button onClick={callBackend}>Call Backend</Button>
      <p className="mt-4">Response: {response}</p>
    </main>
  )
}