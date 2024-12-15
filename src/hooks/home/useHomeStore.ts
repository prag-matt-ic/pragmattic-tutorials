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
    const currentActiveSection = get().activeSection
    if (activeSection === currentActiveSection) return
    set({
      activeSection: activeSection,
      prevActiveSection: currentActiveSection,
    })
  },
  allAreActive: false,
  setAllAreActive: (allAreActive) => set({ allAreActive }),
}))
