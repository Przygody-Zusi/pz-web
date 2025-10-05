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

import { RetirementProfile } from "@/lib/retirementTypes"

export default function UserForm() {
  const [birthYear, setBirthYear] = useState<number | undefined>(undefined)
  const [gender, setGender] = useState("")
  const [startYear, setStartYear] = useState<number | undefined>(undefined)
  const [retirementYear, setRetirementYear] = useState<number | undefined>(undefined)
  const [savings, setSavings] = useState(0.0)
  const [error, setError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!birthYear || !gender || !startYear || !retirementYear) {
      alert("Proszę wypełnić wszystkie pola.")
      return
    }

    // Validate that retirement year is after start year
    if (retirementYear <= startYear) {
      alert("Rok przejścia na emeryturę musi być późniejszy niż rok rozpoczęcia pracy.")
      return
    }

    // Validate that start year is after birth year
    if (startYear <= birthYear) {
      alert("Rok rozpoczęcia pracy musi być późniejszy niż rok urodzenia.")
      return
    }

    const formData = {
      birthYear,
      gender,
      startYear,
      retirementYear,
      savings,
    }

    console.log("Form submitted:", formData)
    alert(`Form submitted!
    Rok urodzin: ${birthYear}
    Płeć: ${gender}
    Rok rozpoczęcia pracy: ${startYear}
    Planowany rok przejścia na emeryturę: ${retirementYear}
    Zgromadzone składki: ${savings}`)
  }

  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedData = localStorage.getItem('dashboardData');
        
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log("Loaded data:", data);

          // Set birth year first since other calculations depend on it
          if (data.profile?.birth_year) {
            const birthYearValue = typeof data.profile.birth_year === 'string' 
              ? parseInt(data.profile.birth_year) 
              : data.profile.birth_year;
            setBirthYear(birthYearValue);
          }

          // Set gender if available
          if (data.profile?.gender) {
            setGender(data.profile.gender);
          }
          
          // Set start year if available
          if (data.profile?.employment_start_date) {
            const startYearValue = typeof data.profile.employment_start_date === 'string'
              ? parseInt(data.profile.employment_start_date)
              : data.profile.employment_start_date;
            setStartYear(startYearValue);
          }
          
          // Set retirement year
          if (data.retirement_goals?.expected_retirement_age) {
            const retirementAge = typeof data.retirement_goals.expected_retirement_age === 'string'
              ? parseInt(data.retirement_goals.expected_retirement_age)
              : data.retirement_goals.expected_retirement_age;
            
            if (birthYear) {
              const retirementYearValue = birthYear + retirementAge;
              setRetirementYear(retirementYearValue);
            }
          } else if (birthYear && gender) {
            // Default retirement age based on gender if no specific age is provided
            const defaultRetirementAge = gender === 'male' ? 65 : 60;
            setRetirementYear(birthYear + defaultRetirementAge);
          }

          // Set savings
          if (data.profile?.savings !== undefined) {
            const savingsValue = typeof data.profile.savings === 'string'
              ? parseFloat(data.profile.savings)
              : data.profile.savings;
            setSavings(savingsValue);
          }

          setError('');
        } else {
          setError('No data found in localStorage');
        }
      } catch (err) {
        setError('Error reading or parsing data from localStorage');
        console.error('localStorage error:', err);
      }
    };

    loadStoredData();
  }, [birthYear, gender]); // Added proper dependencies

  const handleBirthYearChange = (value: string) => {
    const numValue = value ? Number(value) : undefined;
    setBirthYear(numValue);
  };

  const handleStartYearChange = (value: string) => {
    const numValue = value ? Number(value) : undefined;
    setStartYear(numValue);
  }

  const handleRetirementYearChange = (value: string) => {
    const numValue = value ? Number(value) : undefined;
    setRetirementYear(numValue);
  }

  // Generate options for years
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 201 }, (_, i) => 1900 + i).filter(y => y <= 2100)

  // Filter years for retirement to be after start year
  const retirementYears = years.filter(year => !startYear || year > startYear)

  // Filter years for start year to be after birth year
  const startYears = years.filter(year => !birthYear || year > birthYear)

  return (
    <div className="w-full max-w-md">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Profil użytkownika</FieldLegend>
          <FieldDescription>Wprowadź dane potrzebne do obliczeń.</FieldDescription>

          <FieldGroup>
            {/* Birth Year */}
            <Field>
              <FieldLabel htmlFor="birthYear">Rok urodzin</FieldLabel>
              <Select value={birthYear?.toString()} onValueChange={handleBirthYearChange}>
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
                  <SelectValue placeholder={gender || "Wybierz płeć"} />
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
              <Select value={startYear?.toString()} onValueChange={handleStartYearChange}>
                <SelectTrigger id="startYear">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {startYears.map(year => (
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
              <Select value={retirementYear?.toString()} onValueChange={handleRetirementYearChange}>
                <SelectTrigger id="retirementYear">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {retirementYears.map(year => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Savings */}
            <Field>
              <FieldLabel htmlFor="savings">Ilość zgromadzonych składek</FieldLabel>
              <Input
                id="savings"
                type="number"
                value={savings}
                onChange={e => setSavings(Number(e.target.value))}
                placeholder="Podaj zgromadzone składki"
                min={0}
                step="0.01"
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