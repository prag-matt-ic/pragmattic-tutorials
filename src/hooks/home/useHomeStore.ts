import { create } from 'zustand'

export enum SceneSection {
  Purpose = 'purpose',
  Design = 'design',
  Engineering = 'engineering',
}

type SceneStore = {
  hasCompletedIntroScroll: boolean
  setHasCompletedIntroScroll: (hasScrolledIntoView: boolean) => void
  activeSection: SceneSection | null
  prevActiveSection: SceneSection | null
  setActiveSection: (activeSection: SceneSection | null) => void
  sectionsSeen: Record<SceneSection, boolean>
}

const INITIAL_SECTIONS_SEEN = {
  [SceneSection.Purpose]: false,
  [SceneSection.Design]: false,
  [SceneSection.Engineering]: false,
}

export const useHomeSceneStore = create<SceneStore>((set, get) => ({
  hasCompletedIntroScroll: false,
  setHasCompletedIntroScroll: (hasScrolledIntoView) => {
    set({
      hasCompletedIntroScroll: hasScrolledIntoView,
      sectionsSeen: INITIAL_SECTIONS_SEEN,
      activeSection: null,
      prevActiveSection: null,
    })
  },
  activeSection: null,
  prevActiveSection: null,
  sectionsSeen: INITIAL_SECTIONS_SEEN,
  setActiveSection: (activeSection) => {
    const previousActiveSection = get().activeSection
    if (activeSection === previousActiveSection) return
    const newSectionsSeen = !!activeSection ? { ...get().sectionsSeen, [activeSection]: true } : get().sectionsSeen
    set({
      activeSection: activeSection || null,
      prevActiveSection: previousActiveSection,
      sectionsSeen: newSectionsSeen,
    })
  },
}))
