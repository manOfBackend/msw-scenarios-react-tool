import React, { useState } from 'react'
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import type { ExtendedHandlers, PresetHandler } from 'msw-scenarios'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface MSWTestDashboardProps {
  handlers: ExtendedHandlers<PresetHandler[]>
}

const MSWTestDashboard = ({ handlers }: MSWTestDashboardProps) => {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // Extract test endpoints from handlers
  const testEndpoints = handlers.handlers.map((handler) => ({
    method: handler._method.toUpperCase(),
    path: handler._path,
    presets: handler._presets.map((preset) => preset.label),
    description: `${handler._method.toUpperCase()} ${handler._path}`,
  }))

  const testEndpoint = async (method: string, path: string) => {
    const key = `${method}-${path}`
    setLoading((prev) => ({ ...prev, [key]: true }))

    try {
      const response = await fetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      setResults((prev) => ({
        ...prev,
        [key]: {
          success: true,
          data,
          status: response.status,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [key]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }))
    }

    setLoading((prev) => ({ ...prev, [key]: false }))
  }

  const testAll = () => {
    testEndpoints.forEach(({ method, path }) => testEndpoint(method, path))
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>MSW Test Dashboard</span>
            <Button
              onClick={testAll}
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
            testEndpoints.map(({ method, path, presets }) => {
              const key = `${method}-${path}`
              const result = results[key]

              return (
                <Card key={key} className='p-4'>
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
                        onClick={() => testEndpoint(method, path)}
                        disabled={loading[key]}
                        size='sm'
                      >
                        {loading[key] ? (
                          <RefreshCw className='h-4 w-4 animate-spin' />
                        ) : (
                          'Test'
                        )}
                      </Button>
                    </div>

                    {result && (
                      <div
                        className={`rounded-md p-3 ${
                          result.success
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          {result.success ? (
                            <CheckCircle2 className='h-4 w-4' />
                          ) : (
                            <AlertCircle className='h-4 w-4' />
                          )}
                          <span className='font-medium'>
                            {result.success
                              ? `Success (${result.status})`
                              : 'Error'}
                          </span>
                        </div>
                        <pre className='mt-2 overflow-x-auto text-sm'>
                          {JSON.stringify(result.data || result.error, null, 2)}
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

export default MSWTestDashboard
