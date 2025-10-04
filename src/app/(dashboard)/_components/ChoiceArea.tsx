"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export default function ChoiceArea({ setShowPanel }: { setShowPanel: (value: boolean) => void }) {
    return (
        <ScrollArea className="rounded-md border whitespace-nowrap h-2/5 mb-4">
            <div className="flex gap-2 p-8">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Button
                        key={index}
                        className="py-12 px-14 text-lg font-medium"
                        onClick={() => setShowPanel(true)}
                    >
                        Button {index + 1}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}