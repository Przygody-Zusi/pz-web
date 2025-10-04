"use client"

import MainViewCard from "../_components/MainViewCard";
import FactCard from "../_components/FactCard";
import ChatCard from "../_components/ChatCard";

export default function HomePage() {
    return (
        <main className="flex min-h-screen bg-gray-100">
            <section className="w-2/3 p-6">
                <MainViewCard />
            </section>

            <aside className="w-1/3 flex flex-col">
                <FactCard />
                <ChatCard />
            </aside>
        </main>
    )
}