export const useToast = () => {
  const show = useState('toast_show', () => false)
  const message = useState('toast_message', () => '')
  const type = useState('toast_type', () => 'info') // info, success, error, warning

  const trigger = (msg: string, t: 'info'|'success'|'error'|'warning' = 'info') => {
    message.value = msg
    type.value = t
    show.value = true
    setTimeout(() => {
      show.value = false
    }, 4000)
  }

  return {
    show,
    message,
    type,
    trigger,
    success: (msg: string) => trigger(msg, 'success'),
    error: (msg: string) => trigger(msg, 'error'),
    info: (msg: string) => trigger(msg, 'info'),
    warning: (msg: string) => trigger(msg, 'warning')
  }
}
