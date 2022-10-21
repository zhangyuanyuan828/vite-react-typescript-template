import React, { createContext, useContext, useMemo, useState } from 'react'
import { generateStringKey } from '../../utils'
import { MessageBox, MessageBoxProps, MessageBoxWithInputProps, MessageBoxWithoutInputProps } from './MessageBox'

export interface MessageBoxWithoutInputOptions extends Partial<Omit<MessageBoxWithoutInputProps, 'open' | 'showInput' | 'onClose' | 'onCancel' | 'onConfirm'>> {
  onClose?: () => void | boolean | Promise<void | boolean>

  onCancel?: () => void | boolean | Promise<void | boolean>

  onConfirm?: () => void | boolean | Promise<void | boolean>
}

export interface MessageBoxWithInputOptions extends Partial<Omit<MessageBoxWithInputProps, 'open' | 'showInput' | 'onClose' | 'onCancel' | 'onConfirm'>> {
  onClose?: () => void | boolean | Promise<void | boolean>

  onCancel?: () => void | boolean | Promise<void | boolean>

  onConfirm?: (value: string) => void | boolean | Promise<void | boolean>
}

export interface MessageBoxContextType {
  info: (options: MessageBoxWithoutInputOptions) => void

  confirm: (options: MessageBoxWithoutInputOptions) => void

  prompt: (options: MessageBoxWithInputOptions) => void
}

export const MessageBoxContext = createContext<MessageBoxContextType>({
  info() {},
  confirm() {},
  prompt() {}
})

export interface MessageBoxProviderProps {
  children?: React.ReactNode
}

export const useMessageBox = () => useContext(MessageBoxContext)

export const MessageBoxProvider: React.FC<MessageBoxProviderProps> = ({ children }) => {
  const [messageBoxs, setMessageBoxs] = useState<{ props: MessageBoxProps; key: React.Key }[]>([])

  const messageBoxContextValue = useMemo(() => {
    function info(options: MessageBoxWithoutInputOptions) {
      const key = generateStringKey()
      setMessageBoxs(messageBoxs => [
        ...messageBoxs,
        {
          key,
          props: {
            open: true,
            showInput: false,
            showCancelButton: false,
            ...options,
            async onClose() {
              try {
                if (typeof options.onClose === 'function') {
                  const result = await Promise.resolve(options.onClose())
                  if (result !== false) {
                    setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                  }
                } else {
                  setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                }
              } catch (error) {
                console.error(error)
              }
            },
            async onCancel() {
              try {
                if (typeof options.onCancel === 'function') {
                  const result = await Promise.resolve(options.onCancel())
                  if (result !== false) {
                    setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                  }
                } else {
                  setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                }
              } catch (error) {
                console.error(error)
              }
            },
            async onConfirm() {
              try {
                if (typeof options.onConfirm === 'function') {
                  const result = await Promise.resolve(options.onConfirm())
                  if (result !== false) {
                    setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                  }
                } else {
                  setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                }
              } catch (error) {
                console.error(error)
              }
            }
          }
        }
      ])
    }

    function confirm(options: MessageBoxWithoutInputOptions) {
      info({
        showCancelButton: true,
        ...options
      })
    }

    function prompt(options: MessageBoxWithInputOptions) {
      const key = generateStringKey()
      setMessageBoxs(messageBoxs => [
        ...messageBoxs,
        {
          key,
          props: {
            open: true,
            showInput: true,
            showCancelButton: true,
            ...options,
            async onClose() {
              try {
                if (typeof options.onClose === 'function') {
                  const result = await Promise.resolve(options.onClose())
                  if (result !== false) {
                    setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                  }
                } else {
                  setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                }
              } catch (error) {
                console.error(error)
              }
            },
            async onCancel() {
              try {
                if (typeof options.onCancel === 'function') {
                  const result = await Promise.resolve(options.onCancel())
                  if (result !== false) {
                    setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                  }
                } else {
                  setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                }
              } catch (error) {
                console.error(error)
              }
            },
            async onConfirm(value: string) {
              try {
                if (typeof options.onConfirm === 'function') {
                  const result = await Promise.resolve(options.onConfirm(value))
                  if (result !== false) {
                    setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                  }
                } else {
                  setMessageBoxs(messageBoxs => messageBoxs.filter(messageBox => messageBox.key !== key))
                }
              } catch (error) {
                console.error(error)
              }
            }
          }
        }
      ])
    }
    return {
      info,
      confirm,
      prompt
    }
  }, [])

  return (
    <MessageBoxContext.Provider value={messageBoxContextValue}>
      {children}
      {messageBoxs.map(({ key, props }) => (
        <MessageBox key={key} {...props} />
      ))}
    </MessageBoxContext.Provider>
  )
}
