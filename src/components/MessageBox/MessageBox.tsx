import { CheckCircleRounded, CloseRounded, ErrorRounded, InfoRounded, WarningRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogActions,
  dialogClasses,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  SxProps,
  TextField,
  TextFieldProps,
  Theme
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export interface MessageBoxWithoutInputProps {
  className?: string

  sx?: SxProps<Theme>

  style?: React.CSSProperties

  minWidth?: React.CSSProperties['minWidth']

  size?: 'small' | 'medium'

  open: boolean

  title?: React.ReactNode

  content?: React.ReactNode

  type?: 'success' | 'info' | 'warning' | 'error'

  icon?: React.ReactNode

  closeOnClickBackdrop?: boolean

  closeOnPressEscape?: boolean

  showCloseButton?: boolean

  showCancelButton?: boolean

  cancelButtonText?: React.ReactNode

  showConfirmButton?: boolean

  confirmButtonText?: React.ReactNode

  confirmButtonLoadingText?: React.ReactNode

  confirmButtonColor?: ButtonProps['color']

  showInput?: false

  onClose?: () => void

  onCancel?: () => void

  onConfirm?: () => void | Promise<void>
}

export interface MessageBoxWithInputProps extends Omit<MessageBoxWithoutInputProps, 'showInput' | 'onConfirm'> {
  showInput: true

  inputType?: React.InputHTMLAttributes<HTMLInputElement>['type']

  inputValue?: string

  inputVariant?: TextFieldProps['variant']

  inputLabel?: React.ReactNode

  inputPlaceholder?: string

  validate?: (value: string) => string | undefined | Promise<string | undefined>

  onConfirm?: (value: string) => void | Promise<void>
}

export type MessageBoxProps = MessageBoxWithoutInputProps | MessageBoxWithInputProps

export const MessageBoxDefaultIcons = {
  success: <CheckCircleRounded color="success" />,
  info: <InfoRounded color="info" />,
  warning: <WarningRounded color="warning" />,
  error: <ErrorRounded color="error" />
}

export const MessageBox: React.FC<MessageBoxProps> = props => {
  const [loading, setLoading] = useState(false)
  const form = useForm<{ value: string }>({ mode: 'all' })
  const {
    className,
    sx,
    style,
    minWidth,
    size,
    open,
    title,
    content,
    type,
    icon,
    closeOnClickBackdrop,
    closeOnPressEscape,
    showCloseButton,
    showCancelButton,
    cancelButtonText,
    showConfirmButton,
    confirmButtonText,
    confirmButtonLoadingText,
    confirmButtonColor,
    showInput,
    onClose,
    onCancel,
    onConfirm
  } = props
  const { inputType, inputValue, inputVariant, inputLabel, inputPlaceholder, validate } = props.showInput ? props : ({} as Record<string, undefined>)
  const { t } = useTranslation()

  useEffect(() => {
    if (open) {
      form.setValue('value', inputValue ?? '')
      setTimeout(() => {
        form.setFocus('value', { shouldSelect: true })
      }, 0)
    } else {
      form.setValue('value', '')
      form.clearErrors()
    }
  }, [form, open, inputValue])

  function handleDialogClose(event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>, reason: 'backdropClick' | 'escapeKeyDown') {
    if (loading) {
      return
    }
    if (reason === 'backdropClick' && closeOnClickBackdrop) {
      onClose?.()
    }
    if (reason === 'escapeKeyDown' && closeOnPressEscape) {
      onClose?.()
    }
  }

  function handleCloseButtonClick() {
    if (loading) {
      return
    }
    onClose?.()
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (loading) {
      return
    }
    if (event.key === 'Enter') {
      confirm()
    }
  }

  function handleConfirmButtonClick() {
    if (loading) {
      return
    }
    confirm()
  }

  function handleCancelButtonClick() {
    if (loading) {
      return
    }
    onCancel?.()
  }

  async function confirm() {
    setLoading(true)
    try {
      if (showInput) {
        const valid = await form.trigger()
        if (!valid) {
          return
        }
        if (typeof onConfirm === 'function') {
          await Promise.resolve(onConfirm(form.getValues('value')))
        }
      } else {
        if (typeof onConfirm === 'function') {
          await Promise.resolve(onConfirm())
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      sx={{
        ...sx,
        [`& .${dialogClasses.paper}`]: { minWidth }
      }}
      className={className}
      style={style}
      onClose={handleDialogClose}>
      <DialogTitle component="div" display="flex" alignItems="center" justifyContent="space-between" gap={1}>
        <Box>{title}</Box>
        {showCloseButton ? (
          <IconButton aria-label="关闭" disabled={loading} onClick={handleCloseButtonClick} size="small">
            <CloseRounded />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={1}>
          {icon || (type && MessageBoxDefaultIcons[type])}
          <DialogContentText component="div">{content}</DialogContentText>
        </Box>
        {showInput ? (
          <Controller
            control={form.control}
            name="value"
            rules={{ validate: validate }}
            render={({ field, fieldState }) => {
              const { ref, ...fieldProps } = field
              return (
                <TextField
                  variant={inputVariant}
                  margin="dense"
                  size={size}
                  type={inputType}
                  label={inputLabel}
                  placeholder={inputPlaceholder}
                  fullWidth
                  InputProps={{ readOnly: loading }}
                  {...fieldProps}
                  inputRef={ref}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onKeyDown={handleInputKeyDown}
                />
              )
            }}
          />
        ) : null}
      </DialogContent>
      {showCancelButton || showConfirmButton ? (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {showCancelButton ? (
            <Button size={size} disableElevation disabled={loading} onClick={handleCancelButtonClick}>
              {cancelButtonText ?? t('dialog.action.cancel')}
            </Button>
          ) : null}
          {showConfirmButton ? (
            <Button
              variant="contained"
              size={size}
              color={confirmButtonColor ?? type}
              disabled={loading}
              startIcon={loading ? <CircularProgress color="inherit" size="1em" /> : undefined}
              disableElevation
              onClick={handleConfirmButtonClick}>
              {loading ? confirmButtonLoadingText ?? confirmButtonText ?? t('dialog.action.confirm') : confirmButtonText ?? t('dialog.action.confirm')}
            </Button>
          ) : null}
        </DialogActions>
      ) : null}
    </Dialog>
  )
}

MessageBox.defaultProps = {
  minWidth: 400,
  closeOnClickBackdrop: true,
  closeOnPressEscape: true,
  showCancelButton: true,
  showConfirmButton: true,
  size: 'small',
  inputVariant: 'standard'
}
