import { create } from 'zustand'

export enum SceneSection {
  Purpose = 'purpose',
  Design = 'design',
  Engineering = 'engineering',
}

type SceneStore = {
  hasScrolledIntoView: boolean
  setHasScrolledIntoView: (hasScrolledIntoView: boolean) => void
  activeSection: SceneSection | null
  prevActiveSection: SceneSection | null
  setActiveSection: (activeSection: SceneSection | null) => void
  sectionsSeen: Record<SceneSection, boolean>
  isFinalState: boolean
}

const INITIAL_SECTIONS_SEEN = {
  [SceneSection.Purpose]: false,
  [SceneSection.Design]: false,
  [SceneSection.Engineering]: false,
}

export const useHomeSceneStore = create<SceneStore>((set, get) => ({
  hasScrolledIntoView: false,
  setHasScrolledIntoView: (hasScrolledIntoView) => {
    set({
      hasScrolledIntoView,
      isFinalState: false,
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

    // const isFinalState = Object.values(newSectionsSeen).every((section) => section)
    // if (isFinalState) {
    //   setTimeout(() => {
    //     set({ isFinalState: true })
    //   }, 2000)
    // }
  },
  isFinalState: false,
}))
