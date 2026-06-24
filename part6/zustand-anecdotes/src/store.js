
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import anecdoteService from './services/anecdotes'

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = anecdote => ({
//   content: anecdote,
//   id: getId(),
//   votes: 0
// })

const useAnecdoteStore = create(devtools((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    voteAnecdote: async (id) => {
      const anecdoteToUpdate = get().anecdotes.find(a => a.id === id)      
      const updated = await anecdoteService.update(
        id, { ...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a)
      }))
    },
    createAnecdote: async (anecdote) => {
      const newAnecdote = await anecdoteService.createNew(anecdote)
      set(state => ({
        anecdotes: state.anecdotes.concat(newAnecdote)
      }))
    },
    removeAnecdote: async (id) => {
      await anecdoteService.remove(id)
      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (newFilter) => set(() => ({ filter: newFilter })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()      
      set(() => ({ anecdotes }))
    },
  },
})))

let timer
const useNotificationStore = create(set => ({
  notification: '',
  actions: {
    showNotification: (message, seconds=5) => {
      clearTimeout(timer)
      set(() => ({ notification: message }))
      timer = setTimeout(() => {
        set(() => ({ notification: '' }))
      }, seconds * 1000)
    }
  }
}))

export default useAnecdoteStore

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes).toSorted((a, b) => b.votes - a.votes)
  const filter = useAnecdoteStore((state) => state.filter)
  if (filter === '') return anecdotes
  return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
