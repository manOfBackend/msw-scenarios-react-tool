import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  children?: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  onSelect?: (value: string) => void
  isSelected?: boolean
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`

const SelectTrigger = styled.button<{ error?: boolean; isOpen: boolean }>`
  width: 100%;
  min-height: 40px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid
    ${(props) =>
      props.error
        ? props.theme.colors.destructive.DEFAULT
        : props.isOpen
          ? props.theme.colors.primary
          : props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.md};
  color: ${(props) => props.theme.colors.foreground};
  cursor: pointer;
  transition: all ${(props) => props.theme.transitions.DEFAULT};
  font-size: 14px;

  &:hover:not(:disabled) {
    border-color: ${(props) =>
      props.error
        ? props.theme.colors.destructive.DEFAULT
        : props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SelectContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radii.md};
  box-shadow: ${(props) => props.theme.shadows.lg};
  z-index: 50;
  overflow: hidden;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transform: translateY(${(props) => (props.isOpen ? '0' : '-8px')});
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};
  transition: all ${(props) => props.theme.transitions.DEFAULT};
`

const SelectViewport = styled.div`
  padding: 4px;
`

const PlaceholderText = styled.span`
  color: ${(props) => props.theme.colors.gray[500]};
`

const ChevronIcon = styled(ChevronDown)<{ isOpen: boolean }>`
  width: 16px;
  height: 16px;
  color: ${(props) => props.theme.colors.gray[500]};
  transform: rotate(${(props) => (props.isOpen ? '180deg' : '0deg')});
  transition: transform ${(props) => props.theme.transitions.DEFAULT};
`

const StyledSelectItem = styled.button<{ isSelected?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.isSelected ? props.theme.colors.primary : 'transparent'};
  color: ${(props) =>
    props.isSelected
      ? props.theme.colors.background
      : props.theme.colors.foreground};
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: all ${(props) => props.theme.transitions.fast};

  &:hover {
    background: ${(props) =>
      props.isSelected
        ? props.theme.colors.primary
        : props.theme.colors.gray[100]};
  }
`

// Select Item Component
export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ value, children, onSelect, isSelected }, ref) => {
    return (
      <StyledSelectItem
        ref={ref}
        type='button'
        onClick={() => onSelect?.(value)}
        isSelected={isSelected}
      >
        {children}
      </StyledSelectItem>
    )
  }
)

SelectItem.displayName = 'SelectItem'

// Main Select Component
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    value,
    onValueChange,
    placeholder,
    disabled,
    error,
    children,
    className,
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (newValue: string) => {
      onValueChange?.(newValue)
      setIsOpen(false)
    }

    // 자식 요소들을 명시적으로 타입 체크하고 props를 전달
    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (!React.isValidElement<SelectItemProps>(child)) {
          return child
        }

        return React.cloneElement<Partial<SelectItemProps>>(child, {
          onSelect: handleSelect,
          isSelected: child.props.value === value,
        })
      })
    }

    return (
      <SelectContainer ref={containerRef} className={className}>
        <SelectTrigger
          type='button'
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          error={error}
          isOpen={isOpen}
        >
          {value ? (
            <span>{value}</span>
          ) : (
            <PlaceholderText>{placeholder}</PlaceholderText>
          )}
          <ChevronIcon isOpen={isOpen} />
        </SelectTrigger>

        <SelectContent isOpen={isOpen}>
          <SelectViewport>{renderChildren()}</SelectViewport>
        </SelectContent>
      </SelectContainer>
    )
  }
)

Select.displayName = 'Select'
