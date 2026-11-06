import { create } from 'zustand'

const savedTheme = localStorage.getItem('streamvibe-theme')

export const useAppStore = create((set) => ({
  theme: savedTheme === 'dark' ? 'dark' : 'light',
  setTheme: (theme) => {
    localStorage.setItem('streamvibe-theme', theme)
    set({ theme })
  },
  toggleTheme: () => set((state) => {
    const theme = state.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('streamvibe-theme', theme)
    return { theme }
  }),
}))
