'use client'
import Link from 'next/link'
import type { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'filled' | 'outlined' | 'text'
type Size = 'small' | 'medium' | 'large'
type Colour = 'primary' | 'secondary'

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    variant: Variant
    size?: Size
    href?: string
    colour?: Colour
  }>

const SIZE_CLASSES: Record<Size, string> = {
  small: 'py-2 px-4 text-sm',
  medium: 'py-3 px- 6 text-base sm:px-8',
  large: 'py-4 px-10 text-lg',
} as const

const VARIANT_CLASSES: Record<
  Variant,
  {
    [key in Colour]: string
  }
> = {
  filled: {
    primary: 'bg-green text-black hover:bg-white',
    secondary: 'bg-light text-black hover:bg-white',
  },
  outlined: {
    primary: 'border border-green text-white bg-black/30 hover:border-white',
    secondary: 'border border-light text-white hover:text-white bg-black/30',
  },
  text: {
    primary: 'text-white hover:text-green',
    secondary: 'text-white hover:text-light',
  },
} as const

const Button: FC<Props> = (props) => {
  const { children, size = 'medium', variant = 'filled', colour = 'primary', className, href, ...rest } = props

  const button = (
    <button
      {...rest}
      className={twMerge(
        'flex select-none items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full font-sans font-medium leading-none tracking-wide transition-colors duration-300',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant][colour],
        className,
      )}>
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
