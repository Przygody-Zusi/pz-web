"use client"

import { useRef, useState, useEffect } from "react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import RetirementCharts from "../_components/RetirementCharts"
import WrappedSlide from "../_components/WrappedSlide";
import { getRetirementSummary } from "@/lib/retirementCalculator"
import retirementGoals from "@/data/retirementGoals.json"

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const pdfRef = useRef<HTMLDivElement>(null)

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/LLM/generate_mock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: "123", prompt: "Generate mock retirement profile" }),
        })
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error("Błąd podczas pobierania profilu:", err)
      }
    }
    fetchProfile()
  }, [])

  const handleGeneratePDF = async () => {
    if (!profile) return
    setLoading(true)
    try {
      // Compute summary and expected monthly
      const summary = getRetirementSummary(profile)
      const expectedMonthly = (retirementGoals["dobre_zycie"] || 48000) / 12

      // Render hidden charts
      const div = document.createElement("div")
      div.style.width = "800px"
      div.style.padding = "20px"
      div.style.backgroundColor = "#ffffff"
      div.style.position = "absolute"
      div.style.left = "-9999px" // Offscreen
      document.body.appendChild(div)

      const charts = (
        <>

          <RetirementCharts
            predictedMonthly={summary.monthlyRetirement}
            expectedMonthly={expectedMonthly}
            rawContribution={summary.raw}
            valorizedContribution={summary.valorized}
          />
        </>
      )

      // Render React element into div
      import("react-dom/client").then(({ createRoot }) => {
        const root = createRoot(div)
        root.render(charts)

        // Wait a tick to ensure charts render
        setTimeout(async () => {
          const canvas = await html2canvas(div, { scale: 2, backgroundColor: "#ffffff" })
          const imgData = canvas.toDataURL("image/png")
          const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" })
          const pageWidth = pdf.internal.pageSize.getWidth()
          const pageHeight = pdf.internal.pageSize.getHeight()
          const imgProps = pdf.getImageProperties(imgData)
          const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height)
          const imgWidth = imgProps.width * ratio
          const imgHeight = imgProps.height * ratio
          const x = (pageWidth - imgWidth) / 2
          const y = (pageHeight - imgHeight) / 2
          pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
          pdf.save("Raport-Emerytalny.pdf")

          // Clean up
          root.unmount()
          document.body.removeChild(div)
          setLoading(false)
        }, 500)
      })
    } catch (err) {
      console.error("Błąd podczas generowania PDF:", err)
      setLoading(false)
    }
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
      <section className="w-2/3 p-6">
                <WrappedSlide/>
            </section>
      
      <button
        onClick={handleGeneratePDF}
        disabled={loading || !profile}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4f81bd",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generowanie..." : "Wygeneruj raport"}
      </button>
    </main>
  )
}
