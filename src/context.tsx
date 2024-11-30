import type { PresetHandler } from 'msw-scenarios'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { storage } from './storage'

type UseMockOptions = {
  method: string
  path: string
  preset: string
  override?: (draft: { data: any }) => void
}

export type MSWPresetContextType = {
  handlers: PresetHandler[]
  useMock: (options: UseMockOptions) => void
  isReady: boolean
}

const MSWPresetContext = createContext<MSWPresetContextType | null>(null)

export function MSWPresetProvider({
  children,
  value: { handlers, useMock },
}: PropsWithChildren<{ value: Omit<MSWPresetContextType, 'isReady'> }>) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const savedSelections = storage.getSelections()

    const applySelections = async () => {
      for (const selection of savedSelections) {
        try {
          await useMock(selection)
        } catch (error) {
          console.error('Failed to apply preset:', error)
        }
      }
      setIsReady(true)
    }

    applySelections()
  }, [useMock])

  const handleUseMock = useCallback(
    (options: UseMockOptions) => {
      useMock(options)
      storage.saveSelection(options)
    },
    [useMock]
  )

  const contextValue = useMemo(
    () => ({
      handlers,
      useMock: handleUseMock,
      isReady,
    }),
    [handlers, handleUseMock, isReady]
  )

  if (!isReady) {
    return null // 또는 로딩 인디케이터
  }

  return (
    <MSWPresetContext.Provider value={contextValue}>
      {children}
    </MSWPresetContext.Provider>
  )
}

export function useMSWPreset() {
  const context = useContext(MSWPresetContext)
  if (!context) {
    throw new Error('useMSWPreset must be used within MSWPresetProvider')
  }
  return context
}
