import { create } from 'zustand'

export enum SceneSection {
  Purpose = 'purpose',
  Design = 'design',
  Engineering = 'engineering',
}

type SceneStore = {
  activeSection: SceneSection | null
  prevActiveSection: SceneSection | null
  setActiveSection: (activeSection: SceneSection | null) => void

  allAreActive: boolean
  setAllAreActive: (allAreActive: boolean) => void
}

export const useHomeSceneStore = create<SceneStore>((set, get) => ({
  hasCompletedIntroScroll: false,
  activeSection: null,
  prevActiveSection: null,
  setActiveSection: (activeSection) => {
    const previousActiveSection = get().activeSection
    if (activeSection === previousActiveSection) return
    set({
      activeSection: activeSection || null,
      prevActiveSection: previousActiveSection,
    })
  },
  allAreActive: false,
  setAllAreActive: (allAreActive) => set({ allAreActive }),
}))
