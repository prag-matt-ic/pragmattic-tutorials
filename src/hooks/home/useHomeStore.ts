import { create } from 'zustand'

export enum SceneSection {
  None = 'none',
  Purpose = 'purpose',
  Design = 'design',
  Engineering = 'engineering',
}

type SceneStore = {
  hasScrolledIntoView: boolean
  setHasScrolledIntoView: (hasScrolledIntoView: boolean) => void
  activeSection: SceneSection
  sectionsSeen: Record<SceneSection, boolean>
  setSectionsSeen: (activeSection: SceneSection) => void
}

export const useHomeSceneStore = create<SceneStore>((set, get) => ({
  hasScrolledIntoView: false,
  setHasScrolledIntoView: (hasScrolledIntoView) => set({ hasScrolledIntoView }),
  activeSection: SceneSection.None,
  sectionsSeen: {
    [SceneSection.None]: true,
    [SceneSection.Purpose]: true,
    [SceneSection.Design]: true,
    [SceneSection.Engineering]: false,
  },
  setSectionsSeen: (activeSection) =>
    set({
      activeSection,
      sectionsSeen: {
        ...get().sectionsSeen,
        [activeSection]: true,
      },
    }),
}))
