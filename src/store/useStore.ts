import { create } from 'zustand'
import type { Profile, Message } from '@/types/database'

interface AppState {
  // Auth state
  user: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Navigation state
  currentView: 'lobby' | 'my-tree' | 'user-tree'
  viewingUserId: string | null
  
  // Tree state
  messages: Message[]
  allUsers: Profile[]
  
  // Modal state
  selectedMessage: Message | null
  isMessageModalOpen: boolean
  isComposeModalOpen: boolean
  
  // Missions state
  showMissions: boolean
  messagesCompleted: number
  missionsOpened: boolean
  
  // Actions
  setUser: (user: Profile | null) => void
  setLoading: (loading: boolean) => void
  setCurrentView: (view: 'lobby' | 'my-tree' | 'user-tree', userId?: string) => void
  setMessages: (messages: Message[]) => void
  setAllUsers: (users: Profile[]) => void
  openMessageModal: (message: Message) => void
  closeMessageModal: () => void
  openComposeModal: () => void
  closeComposeModal: () => void
  addMessage: (message: Message) => void
  setShowMissions: (show: boolean) => void
  setMessagesCompleted: (count: number) => void
  setMissionsOpened: (opened: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  currentView: 'lobby',
  viewingUserId: null,
  messages: [],
  allUsers: [],
  selectedMessage: null,
  isMessageModalOpen: false,
  isComposeModalOpen: false,
  showMissions: false,
  messagesCompleted: 0,
  missionsOpened: false,
  
  // Actions
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setCurrentView: (currentView, userId) => set({ 
    currentView, 
    viewingUserId: userId || null,
    messages: [] // Clear messages when changing view
  }),
  
  setMessages: (messages) => set({ messages: Array.isArray(messages) ? messages : [] }),
  
  setAllUsers: (allUsers) => set({ allUsers }),
  
  openMessageModal: (message) => set({ 
    selectedMessage: message, 
    isMessageModalOpen: true 
  }),
  
  closeMessageModal: () => set({ 
    selectedMessage: null, 
    isMessageModalOpen: false 
  }),
  
  openComposeModal: () => set({ isComposeModalOpen: true }),
  
  closeComposeModal: () => set({ isComposeModalOpen: false }),
  
  addMessage: (message) => set((state) => {
    // Prevent duplicates
    const exists = state.messages.some(m => m.id === message.id)
    if (exists) return state
    return { messages: [...state.messages, message] }
  }),
  
  setShowMissions: (showMissions) => set((state) => ({ 
    showMissions,
    missionsOpened: showMissions ? true : state.missionsOpened // Mark as opened when shown
  })),
  
  setMessagesCompleted: (messagesCompleted) => set({ messagesCompleted }),
  
  setMissionsOpened: (missionsOpened) => set({ missionsOpened }),
}))

