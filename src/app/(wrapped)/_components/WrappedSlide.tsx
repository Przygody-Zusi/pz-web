"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { getRetirementSummary, getDeflatedAmount  } from "@/lib/retirementCalculator"



export default function RetirementSummarySlides() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasViewedAll, setHasViewedAll] = useState(false)
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile from backend
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/LLM/generate_mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "123",
          prompt: "Generate mock retirement profile"
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      // Calculate expected monthly retirement amount
      const { raw, valorized, monthlyRetirement, replacementRate, avgMonthlySalary } = getRetirementSummary(data)
      const retirementYear = Number(data.profile.date_of_birth) + Number(data.profile.actual_retirement_age);

      const mappedSlides = [
        {
          title: "Twoja przewidywana emerytura",
          text: `Twoja przewidywana emerytura to ${Math.round(monthlyRetirement)} zł miesięcznie.`,
          highlight: "💰",
          bg: "bg-gradient-to-br from-[#ffb34f] via-[#00993f] to-[#3f84d2]",
          textColor: "text-[#ffffff]",
        },
        {
          title: "Siła nabywcza",
          text: `W przeliczeniu na dzisiejszą wartość pieniądze, twoja emerytura to ${Math.round(getDeflatedAmount(monthlyRetirement, retirementYear))} zł miesięcznie.`,
          highlight: "🕰️",
          bg: "bg-gradient-to-br from-[#f05e5e] via-[#ffb34f] to-[#000000]",
          textColor: "text-[#ffffff]",
        },
        {
          title: "Stopa zastąpienia",
          text: `Twoja emerytura będzie: ${(replacementRate).toFixed(2)} twojego ostatniego dochodu!`,
          highlight: "🌅",
          bg: "bg-gradient-to-br from-[#bec3ce] via-[#3f84d2] to-[#00416e]",
          textColor: "text-[#f0f0f0]",
        }

        // {
        //   title: "Twoje oczekiwania",
        //   text: `Twoje oczekiwania: ${data.retirement_goals?.initial_prompt ?? "–"}`,
        //   highlight: "🌅",
        //   bg: "bg-gradient-to-br from-[#bec3ce] via-[#3f84d2] to-[#00416e]",
        //   textColor: "text-gray-100",
        // }
      ];

      setSlides(mappedSlides);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchProfile();
}, []);


  const nextSlide = () => {
    if (slides.length === 0) return
    const next = (currentSlide + 1) % slides.length
    setCurrentSlide(next)
    if (next === slides.length - 1) setHasViewedAll(true)
  }

  if (loading) return <p>Ładowanie danych...</p>
  if (error) return <p className="text-red-500">Błąd: {error}</p>

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
            <p className="text-sm opacity-70 italic mt-6">Kliknij, aby przejść dalej →</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
