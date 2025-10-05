import React, { useState, useEffect } from "react"
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

import {RetirementProfile} from "@/lib/retirementTypes"


export default function UserForm() {
  const [birthYear, setBirthyear] = useState("")
  const [gender, setGender] = useState("")
  const [startYear, setStartYear] = useState("")
  const [retirementYear, setRetirementYear] = useState("")
  const [salary, setSalary] = useState("")
  const [savings, setSavings] = useState("")
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!birthdate || !gender || !startYear || !retirementYear || !salary || !savings) {
      alert("Proszę wypełnić wszystkie pola.")
      return
    }

    const formData = {
      birthdate,
      gender,
      startYear,
      retirementYear,
      salary,
      savings,
    }

    console.log("Form submitted:", formData)
    alert(`Form submitted!
    Data urodzin: ${birthdate}
    Płeć: ${gender}
    Rok rozpoczęcia pracy: ${startYear}
    Planowany rok przejścia na emeryturę: ${retirementYear}
    Wynagrodzenie: ${salary}
    Zgromadzone składki: ${savings}`) 
  }

  useEffect(() => {
    try {
      // Read from localStorage
      const storedData = localStorage.getItem('dashboardData');
      
      if (storedData) {
        // Parse JSON string to object
        let data = JSON.parse(storedData);
        data = JSON.parse(data);

        console.log(typeof(data.profile.gender))
        // Access fields by their name and set to state
        if (data.profile.gender) {
          setGender(data.profile.gender);
          console.log(gender);
          console.log(data.profile.gender);
        }
        
        if (data.profile.employment_start_date) {
          setStartYear(data.profile.employment_start_date);
        }
        
        if (data.retirement_goals.expected_retirement_age) {
          setRetirementYear(data.retirement_goals.expected_retirement_age);
        }

        setError('');
      } else {
        setError('No data found in localStorage');
      }
    } catch (err) {
      // Handle parsing errors or other exceptions
      setError('Error reading or parsing data from localStorage');
      console.error('localStorage error:', err);
    }
  }, []);

  // Generate options for years
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 101 }, (_, i) => 1900 + i).filter(y => y <= 2100)

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Profil użytkownika</FieldLegend>
          <FieldDescription>Wprowadź dane potrzebne do obliczeń.</FieldDescription>

          <FieldGroup>
            {/* Birth Year */}
            <Field>
              <FieldLabel htmlFor="birthYear">Rok urodzin</FieldLabel>
              <Select value={birthYear} onValueChange={setBirthyear}>
                <SelectTrigger id="birthYear">
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

            {/* Gender */}
            <Field>
              <FieldLabel htmlFor="gender">Płeć</FieldLabel>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder={gender} />
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

        <Field orientation="horizontal" className="mt-4">
          <Button type="submit">Dalej</Button>
        </Field>
      </form>
    </div>
  )
}
