import { create } from 'zustand'

const useFeedbackStore = create(set => ({
  stats: {
    good: 0,
    neutral: 0,
    bad: 0,
  },

  actions: {
    increaseGood: () =>
      set(state => ({
        stats: {
          ...state.stats,
          good: state.stats.good + 1,
        },
      })),

    increaseNeutral: () =>
      set(state => ({
        stats: {
          ...state.stats,
          neutral: state.stats.neutral + 1,
        },
      })),

    increaseBad: () =>
      set(state => ({
        stats: {
          ...state.stats,
          bad: state.stats.bad + 1,
        },
      })),
  },
}))

// the hook functions that are used elsewhere in app
export const useFeedback = () => useFeedbackStore(state => state.stats)
export const useFeedbackControls = () => useFeedbackStore(state => state.actions)