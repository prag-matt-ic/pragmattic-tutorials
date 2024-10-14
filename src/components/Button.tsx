'use client'
import useCursorStore from '@/hooks/useCursorStore'
import Link from 'next/link'
import React, { type FC, type MouseEvent, type PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'filled' | 'outlined' | 'text'
type Size = 'small' | 'medium' | 'large'

type Props = PropsWithChildren<{
  variant: Variant
  className?: string
  type?: 'button' | 'submit' | 'reset'
  size?: Size
  href?: string
  isDisabled?: boolean
  hoverEmoji?: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}>

const SIZE_CLASSES: Record<Size, string> = {
  small: 'py-2 px-4 text-sm',
  medium: 'py-3 px-6 text-base sm:px-8',
  large: 'py-4 px-10 text-lg',
} as const

const VARIANT_CLASSES: Record<Variant, string> = {
  text: 'text-white',
  filled: 'bg-black text-white hover:bg-green hover:text-black',
  outlined: 'border border-white/50 hover:border-green text-white bg-black/50',
} as const

const Button: FC<Props> = (props) => {
  const setCursor = useCursorStore((s) => s.setCursor)
  const {
    children,
    size = 'medium',
    variant = 'filled',
    hoverEmoji,
    className,
    href,
    type = 'button',
    isDisabled,
    onClick,
  } = props

  const onPointerEnter = () => setCursor({ type: 'hover', label: hoverEmoji ?? '🚀' })
  const onPointerLeave = () => setCursor({ type: 'default' })

  const button = (
    <button
      type={type}
      className={twMerge(
        'pointer-events-auto flex select-none items-center justify-center gap-3 overflow-hidden rounded-full font-sans font-medium leading-none tracking-wide',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className,
      )}
      onClick={(e) => {
        onClick?.(e)
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      disabled={isDisabled}>
      {children}
    </button>
  )

  if (href?.startsWith('/')) return <Link href={href}>{button}</Link>
  else if (!!href)
    return (
      <a href={href} target="_blank">
        {button}
      </a>
    )

  return button
}

export default Button
