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
}

export const useHomeSceneStore = create<SceneStore>((set, get) => ({
  hasScrolledIntoView: false,
  setHasScrolledIntoView: (hasScrolledIntoView) => set({ hasScrolledIntoView }),
  activeSection: null,
  sectionsSeen: {
    [SceneSection.Purpose]: false,
    [SceneSection.Design]: false,
    [SceneSection.Engineering]: false,
  },
  setSectionsSeen: (activeSection) => {
    if (!activeSection) {
      set({ activeSection: null })
      return
    }
    set({
      activeSection,
      sectionsSeen: {
        ...get().sectionsSeen,
        [activeSection]: true,
      },
    })
  },
}))
