export type SwitchProps = {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
  blocked?: boolean
  disabled?: boolean
}
