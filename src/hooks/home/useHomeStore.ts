import { create } from 'zustand'

export enum SectionId {
  Welcome = 'welcome',
  Services = 'services',
  Philosophy = 'philosophy',
  Testimonials = 'testimonials',
  Contact = 'contact',
}

type HomeStore = {
  isShowingLoading: boolean
  setIsShowingLoading: (hasLoadedScene: boolean) => void
  activeSectionId: SectionId
  setActiveSectionId: (sectionId: SectionId) => void
}

export const useHomeStore = create<HomeStore>((set, get) => ({
  isShowingLoading: true,
  setIsShowingLoading: (isShowingLoading: boolean) => set({ isShowingLoading }),
  activeSectionId: SectionId.Welcome,
  setActiveSectionId: (activeSectionId: SectionId) => set({ activeSectionId: activeSectionId }),
}))

export enum HeaderSection {
  None = 'none',
  Purpose = 'purpose',
  Design = 'design',
  Engineering = 'engineering',
}

type SceneStore = {
  activeSection: HeaderSection
  hasSeenSections: Record<HeaderSection, boolean>
  setActiveSection: (activeSection: HeaderSection) => void
}

export const useHomeSceneStore = create<SceneStore>((set, get) => ({
  activeSection: HeaderSection.None,
  hasSeenSections: {
    [HeaderSection.None]: true,
    [HeaderSection.Purpose]: false,
    [HeaderSection.Design]: false,
    [HeaderSection.Engineering]: false,
  },
  setActiveSection: (activeSection) =>
    set({
      activeSection,
      hasSeenSections: {
        ...get().hasSeenSections,
        [activeSection]: true,
      },
    }),
}))
