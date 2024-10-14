'use client'
import type { ReactNode } from 'react'
import { create } from 'zustand'

export type CursorType = 'default' | 'hover'

type Store = {
  type: CursorType
  label: ReactNode
  resetTimeout: NodeJS.Timeout | null
  setCursor: ({ type, label }: { type: CursorType; label?: ReactNode }) => void
}

const useCursorStore = create<Store>((set, get) => ({
  type: 'default',
  label: null,
  resetTimeout: null,
  setCursor: ({ type, label }) => {
    const existingTimeout = get().resetTimeout
    // Clear timeout in case of multiple calls
    if (!!existingTimeout) clearTimeout(existingTimeout)

    if (type === 'default') {
      // Hide the content after a delay to allow for it to animate out
      let timeout = setTimeout(() => set({ label: null }), 400)
      set({ type: 'default', resetTimeout: timeout })
      // show the cursor when not hovering
      document.body.classList.remove('no-cursor')
    } else {
      set({ type, label })
      // hide the cursor when hovering a button
      document.body.classList.add('no-cursor')
    }
  },
}))

export default useCursorStore
