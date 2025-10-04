"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ChatCard() {
    return (
        <div className="h-1/2 p-4">
            <Card className="h-full shadow-md bg-white flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg">Panel 2</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                    {/* Grid 4 przycisków */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">Akcja 1</button>
                        <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium">Akcja 2</button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium">Akcja 3</button>
                        <button className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium">Akcja 4</button>
                    </div>

                    {/* Chat */}
                    <div className="mt-auto flex flex-col border-t pt-3">
                        <div className="flex-1 overflow-y-auto mb-2 space-y-1 text-sm text-gray-700">
                            <p><b>Bot:</b> Witaj! Jak mogę pomóc?</p>
                            <p><b>Ty:</b> Potrzebuję raportu z systemu.</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Napisz wiadomość..."
                                className="flex-grow border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                Wyślij
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}