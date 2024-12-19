import type {
  ExtendedHandlers,
  PresetHandler,
  MockProfileManager,
} from 'msw-scenarios'

export interface MockManagerProps {
  handlers: ExtendedHandlers<PresetHandler[]>
  profiles: MockProfileManager<any>
  className?: string
}
