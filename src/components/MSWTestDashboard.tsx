import {
  QueryClient,
  QueryClientProvider,
  useQueries,
  useQueryClient,
} from '@tanstack/react-query'
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import type { ExtendedHandlers, PresetHandler } from 'msw-scenarios'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

interface TestEndpoint {
  method: string
  path: string
  presets: string[]
  description: string
}

interface EndpointResponse {
  success: boolean
  data: any
  status: number
}

interface MSWTestDashboardProps {
  handlers: ExtendedHandlers<PresetHandler[]>
}

const TestDashboardContent = ({ handlers }: MSWTestDashboardProps) => {
  const queryClient = useQueryClient()

  const testEndpoints: TestEndpoint[] = handlers.handlers.map((handler) => ({
    method: handler._method.toUpperCase(),
    path: handler._path,
    presets: handler._presets.map((preset) => preset.label),
    description: `${handler._method.toUpperCase()} ${handler._path}`,
  }))

  const endpointQueries = useQueries({
    queries: testEndpoints.map((endpoint) => ({
      queryKey: ['endpoint', endpoint.method, endpoint.path],
      queryFn: async (): Promise<EndpointResponse> => {
        try {
          const response = await fetch(endpoint.path, {
            method: endpoint.method,
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
          return {
            success: true,
            data,
            status: response.status,
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          throw new Error(errorMessage)
        }
      },
    })),
  })

  const refetchAll = () => {
    testEndpoints.forEach(({ method, path }) => {
      queryClient.invalidateQueries({
        queryKey: ['endpoint', method, path],
      })
    })
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>MSW Test Dashboard</span>
            <Button
              onClick={refetchAll}
              className='flex items-center gap-2'
              variant='outline'
            >
              <RefreshCw className='h-4 w-4' />
              Test All Endpoints
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {testEndpoints.length === 0 ? (
            <div className='py-8 text-center text-muted-foreground'>
              No handlers provided
            </div>
          ) : (
            testEndpoints.map((endpoint, index) => {
              const query = endpointQueries[index]
              const { method, path, presets } = endpoint

              return (
                <Card key={`${method}-${path}`} className='p-4'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <code className='rounded bg-secondary px-2 py-1 text-sm'>
                          {method} {path}
                        </code>
                        {presets.length > 0 && (
                          <div className='text-sm text-muted-foreground'>
                            Available Presets: {presets.join(', ')}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => query.refetch()}
                        disabled={query.isFetching}
                        size='sm'
                      >
                        {query.isFetching ? (
                          <RefreshCw className='h-4 w-4 animate-spin' />
                        ) : (
                          'Test'
                        )}
                      </Button>
                    </div>

                    {query.data && (
                      <div
                        className={`rounded-md p-3 ${
                          query.data.success
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          {query.data.success ? (
                            <CheckCircle2 className='h-4 w-4' />
                          ) : (
                            <AlertCircle className='h-4 w-4' />
                          )}
                          <span className='font-medium'>
                            {query.data.success
                              ? `Success (${query.data.status})`
                              : 'Error'}
                          </span>
                        </div>
                        <pre className='mt-2 overflow-x-auto text-sm'>
                          {JSON.stringify(query.data.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    {query.error && (
                      <div className='rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300'>
                        <div className='flex items-center gap-2'>
                          <AlertCircle className='h-4 w-4' />
                          <span className='font-medium'>Error</span>
                        </div>
                        <pre className='mt-2 overflow-x-auto text-sm'>
                          {query.error instanceof Error
                            ? query.error.message
                            : 'Unknown error'}
                        </pre>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const MSWTestDashboard = (props: MSWTestDashboardProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TestDashboardContent {...props} />
    </QueryClientProvider>
  )
}

export default MSWTestDashboard
