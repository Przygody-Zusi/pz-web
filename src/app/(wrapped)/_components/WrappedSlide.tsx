"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function RetirementSummarySlides() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Twoja przewidywana emerytura",
      text: "Twoja przewidywana emerytura to 4 200 zł miesięcznie.",
      highlight: "💰",
      bg: "bg-gradient-to-br from-[#4ECDC4] via-[#556270] to-[#C7F464]",
      textColor: "text-white",
    },
    {
      title: "Lata pracy",
      text: "Przepracujesz około 38 lat, z czego 12 już za Tobą.",
      highlight: "🕰️",
      bg: "bg-gradient-to-br from-[#FF6B6B] via-[#FFD93D] to-[#FFB6B9]",
      textColor: "text-gray-900",
    },
    {
      title: "Przyszłość",
      text: "Dzięki systematycznym wpłatom, Twoja stabilność finansowa po 65 roku życia będzie bardzo dobra.",
      highlight: "🌅",
      bg: "bg-gradient-to-br from-[#A18CD1] via-[#FBC2EB] to-[#FEE140]",
      textColor: "text-gray-800",
    },
  ]

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length)

  return (
    <div
      className="w-full h-[400px] flex items-center justify-center cursor-pointer select-none"
      onClick={nextSlide}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`w-full max-w-md ${slides[currentSlide].bg} rounded-3xl shadow-2xl p-8 transition-colors duration-700`}
        >
          <div className={`text-center space-y-4 ${slides[currentSlide].textColor}`}>
            <div className="text-6xl drop-shadow-lg">{slides[currentSlide].highlight}</div>
            <h2 className="text-3xl font-bold tracking-tight">{slides[currentSlide].title}</h2>
            <p className="text-lg font-medium leading-relaxed opacity-90">
              {slides[currentSlide].text}
            </p>
            <p className="text-sm opacity-70 italic mt-6">Kliknij, aby przejść dalej →</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
