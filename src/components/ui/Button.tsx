import styled from '@emotion/styled'
import { Theme } from '../../styles/theme'

const buttonVariants = {
  default: 'default',
  destructive: 'destructive',
  outline: 'outline',
  secondary: 'secondary',
  ghost: 'ghost',
  link: 'link',
} as const

const buttonSizes = {
  default: 'default',
  sm: 'sm',
  lg: 'lg',
} as const

type ButtonVariant = keyof typeof buttonVariants
type ButtonSize = keyof typeof buttonSizes

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  disabled?: boolean
}

const getVariantStyles = (variant: ButtonVariant, theme: Theme) => {
  const styles = {
    default: `
      background: ${theme.colors.primary};
      color: ${theme.colors.background};
      &:hover:not(:disabled) {
        opacity: 0.9;
      }
    `,
    destructive: `
      background: ${theme.colors.destructive.DEFAULT};
      color: ${theme.colors.destructive.foreground};
      &:hover:not(:disabled) {
        opacity: 0.9;
      }
    `,
    outline: `
      border: 1px solid ${theme.colors.border};
      color: ${theme.colors.foreground};
      &:hover:not(:disabled) {
        background: ${theme.colors.gray[50]};
      }
    `,
    secondary: `
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[900]};
      &:hover:not(:disabled) {
        background: ${theme.colors.gray[200]};
      }
    `,
    ghost: `
      color: ${theme.colors.foreground};
      &:hover:not(:disabled) {
        background: ${theme.colors.gray[50]};
      }
    `,
    link: `
      color: ${theme.colors.primary};
      text-decoration: underline;
      &:hover:not(:disabled) {
        opacity: 0.9;
      }
    `,
  }

  return styles[variant]
}

const getSizeStyles = (size: ButtonSize, theme: Theme) => {
  const styles = {
    default: `
      height: ${theme.spacing[10]};
      padding: 0 ${theme.spacing[4]};
      font-size: 14px;
    `,
    sm: `
      height: ${theme.spacing[8]};
      padding: 0 ${theme.spacing[3]};
      font-size: 13px;
    `,
    lg: `
      height: ${theme.spacing[12]};
      padding: 0 ${theme.spacing[6]};
      font-size: 15px;
    `,
  }

  return styles[size]
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.radii.md};
  font-weight: 500;
  transition: all ${(props) => props.theme.transitions.DEFAULT};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  white-space: nowrap;
  border: none;
  outline: none;

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.ring};
    outline-offset: 2px;
  }

  ${(props) => getVariantStyles(props.variant || 'default', props.theme)}
  ${(props) => getSizeStyles(props.size || 'default', props.theme)}
`

Button.defaultProps = {
  variant: 'default',
  size: 'default',
}
