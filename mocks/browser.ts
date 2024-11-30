import { setupWorker } from 'msw/browser'
import { extendHandlers } from 'msw-scenarios'
import * as handlers from './handlers'

const extendedHandlers = extendHandlers(
  handlers.userHandler,
  handlers.postHandler
)

extendedHandlers.useMock({
  method: 'get',
  path: '/api/user',
  preset: 'success',
})

export const worker = setupWorker(...extendedHandlers.handlers)
export const mswHandlers = extendedHandlers
