"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts"

interface RetirementChartsProps {
  predictedMonthly: number
  expectedMonthly: number
  rawContribution: number
  valorizedContribution: number
}

const RetirementCharts: React.FC<RetirementChartsProps> = ({
  predictedMonthly,
  expectedMonthly,
  rawContribution,
  valorizedContribution,
}) => {
  // Data
  const monthlyData = [
    { name: "Przewidywana", value: predictedMonthly },
    { name: "Oczekiwana", value: expectedMonthly },
  ]

  const contributionData = [
    { name: "Odłożone", value: rawContribution },
    { name: "Waloryzowane", value: valorizedContribution },
  ]

  // HEX colors
  const predictedColor = "#4f81bd"
  const expectedColor = "#c0504d"
  const rawColor = "#9bbb59"
  const valorizedColor = "#8064a2"

  // Round axis ticks to avoid odd numbers
  const getYAxisTicks = (max: number) => {
    const step = Math.ceil(max / 5)
    return [0, step, 2 * step, 3 * step, 4 * step, 5 * step]
  }

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      
      {/* Main Title */}
      <h1 style={{ fontSize: "32px", color: "#222", textAlign: "center", marginBottom: "40px" }}>
        Raport Emerytalny
      </h1>

      {/* Predicted vs Expected Monthly Pension */}
      <h2 style={{ fontSize: "22px", color: "#333", textAlign: "center", marginBottom: "10px" }}>
        Miesięczna emerytura
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "20px" }}>
        <span style={{ fontSize: "20px", color: predictedColor, fontWeight: "bold" }}>
          Przewidywana: {predictedMonthly.toFixed(0)} PLN
        </span>
        <span style={{ fontSize: "20px", color: expectedColor, fontWeight: "bold" }}>
          Oczekiwana: {expectedMonthly.toFixed(0)} PLN
        </span>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={monthlyData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
          <XAxis dataKey="name" stroke="#333" tick={{ fontSize: 14 }} />
          <YAxis 
            stroke="#333" 
            tick={{ fontSize: 14 }} 
            domain={[0, Math.max(predictedMonthly, expectedMonthly) * 1.2]}
            tickFormatter={(value) => Math.round(value)}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(0)} PLN`} 
            contentStyle={{ fontSize: "14px" }}
          />
          <Bar dataKey="value" fill={predictedColor} name="Przewidywana" barSize={60} />
          <Bar dataKey="value" fill={expectedColor} name="Oczekiwana" barSize={60} />
        </BarChart>
      </ResponsiveContainer>

      {/* Raw vs Valorized Contributions */}
      <h2 style={{ fontSize: "22px", color: "#333", textAlign: "center", margin: "40px 0 10px" }}>
        Składki
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "20px" }}>
        <span style={{ fontSize: "20px", color: rawColor, fontWeight: "bold" }}>
          Odłożone: {rawContribution.toFixed(0)} PLN
        </span>
        <span style={{ fontSize: "20px", color: valorizedColor, fontWeight: "bold" }}>
          Waloryzowane: {valorizedContribution.toFixed(0)} PLN
        </span>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={contributionData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
          <XAxis dataKey="name" stroke="#333" tick={{ fontSize: 14 }} />
          <YAxis 
            stroke="#333" 
            tick={{ fontSize: 14 }} 
            domain={[0, Math.max(rawContribution, valorizedContribution) * 1.2]}
            tickFormatter={(value) => Math.round(value)}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(0)} PLN`} 
            contentStyle={{ fontSize: "14px" }}
          />
          <Bar dataKey="value" fill={rawColor} name="Odłożone" barSize={60} />
          <Bar dataKey="value" fill={valorizedColor} name="Waloryzowane" barSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RetirementCharts
