import { create } from 'zustand'
import { videoCatalog } from '../data/videoCatalog'

const savedTheme = localStorage.getItem('streamvibe-theme')
const readStored = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const useAppStore = create((set) => ({
  theme: savedTheme === 'dark' ? 'dark' : 'light',
  videos: readStored('streamvibe-videos', videoCatalog),
  favorites: readStored('streamvibe-favorites', []),
  likedVideos: readStored('streamvibe-likes', []),
  setTheme: (theme) => {
    localStorage.setItem('streamvibe-theme', theme)
    set({ theme })
  },
  toggleTheme: () => set((state) => {
    const theme = state.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('streamvibe-theme', theme)
    return { theme }
  }),
  toggleFavorite: (id) => set((state) => {
    const favorites = state.favorites.includes(id)
      ? state.favorites.filter((item) => item !== id)
      : [...state.favorites, id]
    save('streamvibe-favorites', favorites)
    return { favorites }
  }),
  toggleLike: (id) => set((state) => {
    const likedVideos = state.likedVideos.includes(id)
      ? state.likedVideos.filter((item) => item !== id)
      : [...state.likedVideos, id]
    save('streamvibe-likes', likedVideos)
    return { likedVideos }
  }),
  addVideo: (video) => set((state) => {
    const videos = [video, ...state.videos]
    save('streamvibe-videos', videos)
    return { videos }
  }),
  updateVideo: (id, changes) => set((state) => {
    const videos = state.videos.map((video) => video.id === id ? { ...video, ...changes } : video)
    save('streamvibe-videos', videos)
    return { videos }
  }),
  removeVideo: (id) => set((state) => {
    const videos = state.videos.filter((video) => video.id !== id)
    save('streamvibe-videos', videos)
    return { videos }
  }),
}))
