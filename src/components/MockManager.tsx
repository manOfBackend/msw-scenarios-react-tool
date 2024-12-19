import React, { useEffect, useMemo, useState } from 'react'
import { Settings, X } from 'lucide-react'
import { useMockStore } from '@/store/mockStore'
import type {
  ExtendedHandlers,
  PresetHandler,
  MockProfileManager,
} from 'msw-scenarios'
import * as S from './styles'

export interface MockManagerProps {
  handlers: ExtendedHandlers<PresetHandler[]>
  profiles: MockProfileManager<any>
  className?: string
}

export const MockManager: React.FC<MockManagerProps> = ({
  handlers,
  profiles,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'presets' | 'profiles'>('presets')

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
    <S.Container className={className}>
      <S.FloatingButton onClick={() => setIsOpen(true)}>
        <Settings size={24} />
        {activePresetsCount > 0 && <S.Badge>{activePresetsCount}</S.Badge>}
      </S.FloatingButton>

      <S.Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />

      <S.Sheet isOpen={isOpen}>
        <S.Header>
          <S.Title>Mock Manager</S.Title>
          <S.ActiveCount>활성: {activePresetsCount}</S.ActiveCount>
          <S.CloseButton onClick={() => setIsOpen(false)}>
            <X size={20} />
          </S.CloseButton>
        </S.Header>

        <S.Content>
          <S.TabList>
            <S.Tab
              active={activeTab === 'presets'}
              onClick={() => setActiveTab('presets')}
            >
              프리셋
            </S.Tab>
            <S.Tab
              active={activeTab === 'profiles'}
              onClick={() => setActiveTab('profiles')}
            >
              프로파일
            </S.Tab>
          </S.TabList>

          {activeTab === 'presets' && (
            <S.Section>
              {allHandlers.map(({ method, path, presets, currentPreset }) => (
                <S.HandlerCard key={`${method}-${path}`}>
                  <S.HandlerInfo>
                    <div>
                      <S.MethodPath>
                        {method.toUpperCase()} {path}
                      </S.MethodPath>
                      {currentPreset !== 'real-api' && (
                        <S.ActivePreset>Active: {currentPreset}</S.ActivePreset>
                      )}
                    </div>
                  </S.HandlerInfo>
                  <S.Controls>
                    <S.Select
                      value={currentPreset}
                      onChange={(e) => setPreset(method, path, e.target.value)}
                    >
                      <option value='real-api'>Real API (Default)</option>
                      {presets.map((preset) => (
                        <option key={preset.label} value={preset.label}>
                          {preset.label}
                        </option>
                      ))}
                    </S.Select>
                    <S.Button
                      variant='outline'
                      onClick={() => setPreset(method, path, 'real-api')}
                    >
                      초기화
                    </S.Button>
                  </S.Controls>
                </S.HandlerCard>
              ))}

              {allHandlers.length > 0 && (
                <S.Button variant='outline' onClick={reset}>
                  모두 초기화
                </S.Button>
              )}
            </S.Section>
          )}

          {activeTab === 'profiles' && (
            <S.ProfilesCard>
              <S.ProfilesTitle>Profiles</S.ProfilesTitle>
              <S.Select
                value={currentProfile || ''}
                onChange={(e) => setProfile(e.target.value)}
              >
                <option value='' disabled>
                  Select Profile
                </option>
                {availableProfiles.map((profile) => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </S.Select>

              {currentProfile && (
                <S.Button
                  variant='outline'
                  onClick={() => setProfile('default')}
                  style={{ marginTop: '16px', width: '100%' }}
                >
                  초기화
                </S.Button>
              )}
            </S.ProfilesCard>
          )}
        </S.Content>
      </S.Sheet>
    </S.Container>
  )
}
