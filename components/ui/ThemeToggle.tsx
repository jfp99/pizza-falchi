'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent SSR mismatch
  if (!mounted) {
    return (
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-surface dark:bg-surface border border-border dark:border-border" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center justify-center
        w-9 h-9 md:w-10 md:h-10 rounded-lg
        bg-surface dark:bg-surface
        border border-border dark:border-border
        hover:bg-background-tertiary dark:hover:bg-border-medium
        text-text-secondary dark:text-text-secondary
        transition-all duration-200 ease-in-out
        hover:scale-110 hover:rotate-180
        focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1
        cursor-pointer
      "
      aria-label={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <Sun className="w-4 h-4 md:w-5 md:h-5" />
      )}
    </button>
  )
}
