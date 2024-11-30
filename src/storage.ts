import { SelectedPresetInfo } from './types'

const STORAGE_KEY = 'msw-preset-selections'

export const storage = {
  getSelections: (): SelectedPresetInfo[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveSelection: (selection: SelectedPresetInfo) => {
    try {
      const currentSelections = storage.getSelections()
      const index = currentSelections.findIndex(
        (s) => s.method === selection.method && s.path === selection.path
      )

      if (index !== -1) {
        currentSelections[index] = selection
      } else {
        currentSelections.push(selection)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSelections))
    } catch (error) {
      console.error('Failed to save preset selection:', error)
    }
  },
}
