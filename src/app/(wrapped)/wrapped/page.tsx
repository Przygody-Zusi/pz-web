"use client"

import WrappedSlide from "../_components/WrappedSlide";


export default function HomePage() {
    return (
        <main className="flex min-h-screen bg-gray-100">
            <section className="w-2/3 p-6">
                <WrappedSlide/>
            </section>
        </main>
    )
}