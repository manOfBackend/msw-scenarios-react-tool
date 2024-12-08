import { setupWorker } from 'msw/browser'
import { workerManager } from 'msw-scenarios'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers.handlers)
workerManager.setupWorker(worker)
