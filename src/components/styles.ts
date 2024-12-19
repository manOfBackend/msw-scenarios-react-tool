import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const Container = styled.div`
  position: relative;
`

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  &:hover {
    background: #f9fafb;
  }
`

export const Badge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: all 0.2s ease;
`

export const Sheet = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 85vh;
  background: white;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  transform: translateY(${(props) => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  z-index: 101;
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    height: 80vh;
  }
`

export const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: 24px;
  }
`

export const ActiveCount = styled.span`
  font-size: 14px;
  color: #6b7280;
  margin-right: 40px;
`

export const CloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  @media (min-width: 640px) {
    padding: 24px;
  }
`

export const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 16px;
`

export const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: ${(props) => (props.active ? 'white' : 'transparent')};
  color: ${(props) => (props.active ? '#111827' : '#6b7280')};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #111827;
  }
`

export const Section = styled.div`
  margin-top: 16px;
`

export const HandlerCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`

export const HandlerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
`

export const MethodPath = styled.code`
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
`

export const ActivePreset = styled.span`
  color: #059669;
  font-size: 14px;
  font-weight: 500;
`

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

export const ProfilesCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`

export const ProfilesTitle = styled.h2`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
`

// src/components/ui/Select.tsx
export const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`

export const Button = styled.button<{ variant?: 'outline' | 'ghost' }>`
  height: 40px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === 'outline' &&
    css`
      border: 1px solid #e5e7eb;
      background: white;
      color: #111827;

      &:hover {
        background: #f9fafb;
      }
    `}

  ${(props) =>
    props.variant === 'ghost' &&
    css`
      border: none;
      background: transparent;
      color: #6b7280;

      &:hover {
        background: #f3f4f6;
        color: #111827;
      }
    `}
`
