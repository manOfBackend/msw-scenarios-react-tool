import { useState } from 'react'
import { storage } from '../storage'
import type { PresetHandler } from 'msw-scenarios'
import { useMSWPreset } from '@/context'

export function MSWPresetUI() {
  const { handlers, useMock } = useMSWPreset()
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // 초기 선택된 프리셋 상태 설정
  const savedSelections = storage.getSelections()
  const [selectedPresets, setSelectedPresets] = useState<
    Record<string, string>
  >(
    savedSelections.reduce(
      (acc, selection) => {
        acc[`${selection.method}-${selection.path}`] = selection.preset
        return acc
      },
      {} as Record<string, string>
    )
  )

  const handleTestRequest = async (handler: PresetHandler) => {
    const key = `${handler._method}-${handler._path}`
    setLoading((prev) => ({ ...prev, [key]: true }))

    try {
      const response = await fetch(handler._path)
      const data = await response.json()
      setResponses((prev) => ({ ...prev, [key]: data }))
    } catch (error) {
      setResponses((prev) => ({ ...prev, [key]: { error: 'Request failed' } }))
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  return (
    <div className='w-full max-w-2xl rounded-lg border bg-white shadow'>
      <div className='border-b p-4'>
        <h2 className='text-lg font-semibold'>MSW Preset Controller</h2>
        <p className='text-sm text-gray-500'>
          Control your API mocks with presets
        </p>
      </div>
      <div className='space-y-4 p-4'>
        {handlers.map((handler) => {
          const presets = handler._presets || []
          const key = `${handler._method}-${handler._path}`

          return (
            <div key={key} className='space-y-2 border-b pb-4 last:border-b-0'>
              <div className='flex items-center space-x-2'>
                <span className='rounded bg-gray-100 px-2 py-1 text-xs font-medium uppercase'>
                  {handler._method}
                </span>
                <span className='font-mono text-sm'>{handler._path}</span>
              </div>
              <div className='flex gap-2'>
                <select
                  className='flex-1 rounded border p-2'
                  value={selectedPresets[key] || ''}
                  onChange={(e) => {
                    const preset = e.target.value
                    setSelectedPresets((prev) => ({ ...prev, [key]: preset }))
                    useMock({
                      method: handler._method,
                      path: handler._path,
                      preset,
                    })
                  }}
                >
                  <option value='' disabled>
                    Select a preset
                  </option>
                  {presets.map((preset) => (
                    <option key={preset.label} value={preset.label}>
                      {preset.label} ({preset.status})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleTestRequest(handler)}
                  disabled={loading[key]}
                  className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300'
                >
                  {loading[key] ? 'Testing...' : 'Test'}
                </button>
              </div>
              {responses[key] && (
                <div className='mt-2'>
                  <div className='rounded bg-gray-50 p-2'>
                    <pre className='text-sm'>
                      {JSON.stringify(responses[key], null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
