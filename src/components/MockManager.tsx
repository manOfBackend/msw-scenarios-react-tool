import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/Sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useMockStore } from '@/store/mockStore'
import { Settings } from 'lucide-react'
import type { ExtendedHandlers, PresetHandler } from 'msw-scenarios'
import type { MockProfileManager } from 'msw-scenarios'
import { useEffect, useMemo } from 'react'

interface MockManagerProps {
  handlers: ExtendedHandlers<PresetHandler[]>
  profiles: MockProfileManager<any>
  className?: string
}

export const MockManager = ({
  handlers,
  profiles,
  className,
}: MockManagerProps) => {
  const {
    mockingStatus,
    currentProfile,
    setMockHandlers,
    setMockProfiles,
    setPreset,
    setProfile,
    reset,
  } = useMockStore()

  useEffect(() => {
    setMockHandlers(handlers)
    setMockProfiles(profiles)
  }, [handlers, profiles, setMockHandlers, setMockProfiles])

  const allHandlers = useMemo(
    () =>
      handlers.handlers.map((handler) => ({
        method: handler._method,
        path: handler._path,
        presets: handler._presets,
        currentPreset:
          mockingStatus.find(
            (status) =>
              status.method === handler._method && status.path === handler._path
          )?.currentPreset || 'real-api',
      })),
    [mockingStatus, handlers]
  )

  const activePresetsCount = mockingStatus.length
  const availableProfiles = profiles.getAvailableProfiles()

  return (
    <div className={`msw-preset-manager ${className}`}>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            size='default'
            className='fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-white shadow-lg hover:bg-gray-100'
            aria-label='Open mock manager'
          >
            <Settings className='h-6 w-6' />
            {activePresetsCount > 0 && (
              <span
                className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'
                aria-label={`${activePresetsCount} active mocks`}
              >
                {activePresetsCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side='bottom'
          className='flex h-[85vh] flex-col rounded-t-lg border-t border-border p-0 sm:h-[80vh]'
        >
          <SheetTitle className='sr-only'>설정</SheetTitle>
          <div className='flex items-center justify-between border-b p-4 sm:p-6'>
            <h1 className='text-xl font-bold sm:text-2xl'>Mock Manager</h1>
            <span className='mr-10 text-sm text-muted-foreground'>
              활성: {activePresetsCount}
            </span>
          </div>

          <div className='flex-1 overflow-y-auto'>
            <div className='mx-auto max-w-3xl p-4 pt-0 sm:p-6 sm:pt-0'>
              <Tabs defaultValue='presets' className='space-y-4'>
                <TabsList className='sticky top-0 z-10 grid w-full grid-cols-2 bg-background'>
                  <TabsTrigger value='presets'>프리셋</TabsTrigger>
                  <TabsTrigger value='profiles'>프로파일</TabsTrigger>
                </TabsList>
                <TabsContent value='presets' className='mt-2 space-y-4'>
                  {allHandlers.map(
                    ({ method, path, presets, currentPreset }) => (
                      <div
                        key={`${method}-${path}`}
                        className='flex flex-col space-y-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-4'
                      >
                        <div className='space-y-2 sm:space-y-0'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='rounded bg-secondary px-2 py-1 font-mono text-sm'>
                              {method.toUpperCase()} {path}
                            </span>
                            {currentPreset !== 'real-api' && (
                              <span className='text-sm font-medium text-green-600'>
                                Active: {currentPreset}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className='flex flex-col gap-2 sm:flex-row'>
                          <Select
                            value={currentPreset}
                            onValueChange={(value) =>
                              setPreset(method, path, value)
                            }
                          >
                            <SelectTrigger className='w-full sm:w-[180px]'>
                              <SelectValue placeholder='Select preset' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='real-api'>
                                Real API (Default)
                              </SelectItem>
                              {presets.map((preset) => (
                                <SelectItem
                                  key={preset.label}
                                  value={preset.label}
                                >
                                  {preset.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant='outline'
                            onClick={() => setPreset(method, path, 'real-api')}
                            className='w-full sm:w-auto'
                          >
                            초기화
                          </Button>
                        </div>
                      </div>
                    )
                  )}

                  {allHandlers.length > 0 && (
                    <Button
                      className='mt-4 w-full'
                      variant='outline'
                      onClick={reset}
                    >
                      모두 초기화
                    </Button>
                  )}
                </TabsContent>
                <TabsContent value='profiles' className='mt-2'>
                  <div className='space-y-4 rounded-lg border p-4'>
                    <h2 className='text-sm font-medium text-muted-foreground'>
                      Profiles
                    </h2>
                    <Select
                      value={currentProfile || undefined}
                      onValueChange={setProfile}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select Profile' />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem value='default'>
                          Default (Real API)
                        </SelectItem> */}
                        {availableProfiles.map((profile) => (
                          <SelectItem key={profile} value={profile}>
                            {profile}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {currentProfile && (
                      <div className='pt-2'>
                        <Button
                          variant='outline'
                          onClick={() => setProfile('default')}
                          className='w-full'
                        >
                          초기화
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
