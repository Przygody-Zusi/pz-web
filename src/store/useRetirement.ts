import { create } from "zustand"
import { RetirementProfile } from "@/lib/retirementTypes"

interface RetirementStore {
  retirementProfile: RetirementProfile | null
  setRetirementProfile: (profile: RetirementProfile) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

export const useRetirementStore = create<RetirementStore>((set) => ({
  retirementProfile: null,
  setRetirementProfile: (profile) => set({ retirementProfile: profile }),
  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),
}))
