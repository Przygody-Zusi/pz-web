"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChoicePanel({ setShowPanel }: { setShowPanel: (value: boolean) => void }) {
    return (
        <div className="mt-auto border-t pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-start gap-6">
                {/* Kolumna inputów */}
                <div className="flex flex-col gap-3 w-1/2">
                    <Input placeholder="Imię" />
                    <Input placeholder="Nazwisko" />
                    <Input placeholder="Email" />
                    <Input placeholder="Wiadomość" />
                </div>

                {/* Kolumna przykładowych przycisków */}
                <div className="flex flex-col gap-3 w-1/2">
                    <Button variant="outline">Zapisz</Button>
                    <Button variant="secondary">Wyczyść</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Wyślij</Button>
                </div>
            </div>

            {/* Przycisk ukrycia panelu */}
            <div className="mt-4 text-right">
                <Button variant="ghost" onClick={() => setShowPanel(false)}>
                    Schowaj panel
                </Button>
            </div>
        </div>
    );
}