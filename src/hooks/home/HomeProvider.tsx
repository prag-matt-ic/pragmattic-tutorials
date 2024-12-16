'use client'
import { type FC, type PropsWithChildren, useContext, useRef } from 'react'
import { createContext } from 'react'
import { useStore } from 'zustand'

import { createHomeStore, type HomeState, type HomeStore } from './createHomeStore'

export const HomeContext = createContext<HomeStore | null>(null)

type Props = PropsWithChildren<{
  isMobile: boolean
}>

export const HomeProvider: FC<Props> = ({ children, isMobile }) => {
  const store = useRef(createHomeStore(isMobile))
  return <HomeContext.Provider value={store.current}>{children}</HomeContext.Provider>
}

export function useHomeStore<T>(selector: (state: HomeState) => T): T {
  const store = useContext(HomeContext)
  if (!store) throw new Error('Missing HomeContext in the tree')
  return useStore(store, selector)
}
