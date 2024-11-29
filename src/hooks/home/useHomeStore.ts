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
  sectionsSeen: Record<SceneSection, boolean>
  setSectionsSeen: (activeSection: SceneSection | null) => void
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
    set({ hasScrolledIntoView, isFinalState: false, sectionsSeen: INITIAL_SECTIONS_SEEN, activeSection: null })
  },
  activeSection: null,
  sectionsSeen: INITIAL_SECTIONS_SEEN,
  setSectionsSeen: (activeSection) => {
    if (!activeSection) {
      set({ activeSection: null })
      return
    }
    const newSectionsSeen = { ...get().sectionsSeen, [activeSection]: true }
    // If all true, set final state
    set({
      activeSection,
      sectionsSeen: newSectionsSeen,
    })

    const isFinalState = Object.values(newSectionsSeen).every((section) => section)
    if (isFinalState) {
      setTimeout(() => {
        set({ isFinalState: true })
      }, 2000)
    }
  },
  isFinalState: false,
}))
