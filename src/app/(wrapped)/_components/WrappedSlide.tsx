"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export default function RetirementSummarySlides() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasViewedAll, setHasViewedAll] = useState(false)

  const slides = [
    {
      title: "Twoja przewidywana emerytura",
      text: "Twoja przewidywana emerytura to 4 200 zł miesięcznie.",
      highlight: "💰",
      bg: "bg-gradient-to-br from-[#ffb34f] via-[#00993f] to-[#3f84d2]",
      textColor: "text-white",
    },
    {
      title: "Siła nabywcza",
      text: "W przeliczeniu na dzisiejszą wartość pieniądze, twoja emerytura to 2 000 zł miesięcznie.",
      highlight: "🕰️",
      bg: "bg-gradient-to-br from-[#f05e5e] via-[#ffb34f] to-[#000000]",
      textColor: "text-white",
    },
    {
      title: "Twoje oczekiwania",
      text: "Żeby móc PŁYWAĆ JACHTEM potrzebujesz jeszcze 50 milionów. Możesz to osiągnąć przechodząc na emeryturę 20 lat później.",
      highlight: "🌅",
      bg: "bg-gradient-to-br from-[#bec3ce] via-[#3f84d2] to-[#00416e]",
      textColor: "text-gray-100",
    },
  ]

  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length
    setCurrentSlide(next)
    if (next === slides.length - 1) setHasViewedAll(true)
  }

  if (isMinimized) {
    return (
      <motion.button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-[#00416e] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        💬
      </motion.button>
    )
  }

  return (
    <div
      className="w-full h-[400px] flex items-center justify-center cursor-pointer select-none relative"
      onClick={nextSlide}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`relative w-full max-w-md ${slides[currentSlide].bg} rounded-3xl shadow-2xl p-8 transition-colors duration-700`}
        >
          {/* Minimize button (only appears after all slides have been seen at least once) */}
          {hasViewedAll && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(true)
              }}
              className="absolute top-3 right-3 text-white/80 hover:text-white"
            >
              <X size={24} />
            </button>
          )}

          <div className={`text-center space-y-4 ${slides[currentSlide].textColor}`}>
            <div className="text-6xl drop-shadow-lg">{slides[currentSlide].highlight}</div>
            <h2 className="text-3xl font-bold tracking-tight">{slides[currentSlide].title}</h2>
            <p className="text-lg font-medium leading-relaxed opacity-90 whitespace-pre-line">
              {slides[currentSlide].text}
            </p>
            <p className="text-sm opacity-70 italic mt-6">
              Kliknij, aby przejść dalej →
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
