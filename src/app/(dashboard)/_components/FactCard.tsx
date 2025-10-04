"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function FactCard() {
    return (
        <div className="h-1/2 p-4">
            <Card className="h-full shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-lg">Panel 1</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">Zusia</p>
                    <Image
                        src="/purple.png"
                        alt="Zusia"
                        width={200}
                        height={200}
                        className="rounded-lg mt-2"
                    />
                </CardContent>
            </Card>
        </div>
    );
}