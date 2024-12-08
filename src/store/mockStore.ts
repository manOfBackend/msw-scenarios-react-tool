import type {
  ExtendedHandlers,
  MockingStatus,
  MockProfileManager,
  PresetHandler,
} from 'msw-scenarios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MockState {
  mockingStatus: MockingStatus[]
  currentProfile: string | null
  handlers: ExtendedHandlers<PresetHandler[]> | null
  profiles: MockProfileManager<any> | null
  setMockHandlers: (handlers: ExtendedHandlers<PresetHandler[]>) => void
  setMockProfiles: (profiles: MockProfileManager<any>) => void
  setPreset: (method: string, path: string, preset: string) => void
  setProfile: (profileName: string) => void
  reset: () => void
  resetEndpoint: (method: string, path: string) => void
}

export const useMockStore = create<MockState>()(
  persist(
    (set, get) => ({
      mockingStatus: [],
      currentProfile: null,
      handlers: null,
      profiles: null,

      setMockHandlers: (handlers) => {
        set({ handlers })

        const { mockingStatus } = get()

        if (mockingStatus.length > 0) {
          mockingStatus.forEach(({ method, path, currentPreset }) => {
            if (currentPreset === 'real-api') {
              handlers.useRealAPI({ method: method as any, path })
            } else if (currentPreset) {
              handlers.useMock({
                method: method as any,
                path,
                preset: currentPreset,
              })
            }
          })
        }

        handlers.subscribeToChanges(({ status, currentProfile }) => {
          set({
            mockingStatus: status,
            currentProfile,
          })
        })
      },

      setMockProfiles: (profiles) => {
        set({ profiles })
      },

      setPreset: (method, path, preset) => {
        const { handlers } = get()
        if (!handlers) return

        if (preset === 'real-api') {
          handlers.useRealAPI({ method: method as any, path })
        } else {
          handlers.useMock({
            method: method as any,
            path,
            preset,
          })
        }
      },

      setProfile: (profileName) => {
        const { handlers, profiles } = get()
        if (!handlers || !profiles) return

        if (profileName === 'default') {
          handlers.reset()
        } else {
          profiles.useMock(profileName)
        }
      },

      reset: () => {
        const { handlers } = get()
        if (!handlers) return
        handlers.reset()
      },

      resetEndpoint: (method, path) => {
        const { handlers } = get()
        if (!handlers) return
        handlers.useRealAPI({ method: method as any, path })
      },
    }),
    {
      name: 'msw-scenarios-storage',
      partialize: (state) => ({
        mockingStatus: state.mockingStatus,
        // currentProfile: state.currentProfile,
      }),
    }
  )
)
