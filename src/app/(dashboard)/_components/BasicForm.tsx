import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function UserForm() {
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [startYear, setStartYear] = useState("")
  const [retirementYear, setRetirementYear] = useState("")
  const [salary, setSalary] = useState("")
  const [savings, setSavings] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!age || !gender || !startYear || !retirementYear || !salary || !savings) {
      alert("Proszę wypełnić wszystkie pola.")
      return
    }

    const formData = {
      age,
      gender,
      startYear,
      retirementYear,
      salary,
      savings,
    }

    console.log("Form submitted:", formData)
    alert(`Form submitted!
Wiek: ${age}
Płeć: ${gender}
Rok rozpoczęcia pracy: ${startYear}
Planowany rok przejścia na emeryturę: ${retirementYear}
Wynagrodzenie: ${salary}
Zgromadzone składki: ${savings}`)

    setAge("")
    setGender("")
    setStartYear("")
    setRetirementYear("")
    setSalary("")
    setSavings("")
  }

  // Generate options for years
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 101 }, (_, i) => 1900 + i).filter(y => y <= 2100)

  return (
    <div className="w-full max-w-md items-center mx-auto mb-16">
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Profil użytkownika</FieldLegend>
          <FieldDescription>Wprowadź dane potrzebne do obliczeń.</FieldDescription>

          <FieldGroup>
            {/* Age */}
            <Field>
              <FieldLabel htmlFor="age">Wiek</FieldLabel>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="Podaj swój wiek"
                min={0}
                max={120}
              />
            </Field>

            {/* Gender */}
            <Field>
              <FieldLabel htmlFor="gender">Płeć</FieldLabel>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Wybierz płeć" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Mężczyzna</SelectItem>
                  <SelectItem value="female">Kobieta</SelectItem>
                  <SelectItem value="other">Inne</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Start Year */}
            <Field>
              <FieldLabel htmlFor="startYear">Rok rozpoczęcia pracy</FieldLabel>
              <Select value={startYear} onValueChange={setStartYear}>
                <SelectTrigger id="startYear">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Retirement Year */}
            <Field>
              <FieldLabel htmlFor="retirementYear">Planowany rok przejścia na emeryturę</FieldLabel>
              <Select value={retirementYear} onValueChange={setRetirementYear}>
                <SelectTrigger id="retirementYear">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Salary */}
            <Field>
              <FieldLabel htmlFor="salary">Wynagrodzenie (brutto)</FieldLabel>
              <Input
                id="salary"
                type="number"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="Podaj swoje wynagrodzenie"
                min={0}
              />
            </Field>

            {/* Savings */}
            <Field>
              <FieldLabel htmlFor="savings">Ilość zgromadzonych składek</FieldLabel>
              <Input
                id="savings"
                type="number"
                value={savings}
                onChange={e => setSavings(e.target.value)}
                placeholder="Podaj zgromadzone składki"
                min={0}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal" className="mt-4 ">
          <Button type="submit" className="w-full">Dalej</Button>
        </Field>
      </form>
    </div>
  )
}
