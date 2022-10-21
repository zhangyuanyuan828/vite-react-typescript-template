import { DarkModeRounded, LightModeRounded, PendingRounded, SettingsBrightnessRounded } from '@mui/icons-material'
import { Box, Button, ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useMessageBox } from '../../components'
import { useColorMode } from '../../theme'

const types = ['success', 'info', 'warning', 'error'] as const

const icon = <PendingRounded color="action" />

export function Home() {
  const { colorMode, setColorMode } = useColorMode()
  const { info, confirm, prompt } = useMessageBox()
  const { enqueueSnackbar } = useSnackbar()

  const handleColorModeChange: ToggleButtonGroupProps['onChange'] = (event, value) => {
    if (value) {
      setColorMode(value)
    }
  }

  function handleInfoClick(type?: typeof types[number], icon?: React.ReactNode) {
    info({
      title: '消息',
      content: '这是一段消息',
      type,
      icon,
      showCloseButton: true,
      onConfirm() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 1500)
        })
      }
    })
  }

  function handleConfirmClick(type?: typeof types[number], icon?: React.ReactNode) {
    confirm({
      title: '警告',
      content: '确定删除该数据？操作不可撤销！',
      type,
      icon,
      showCloseButton: true,
      onConfirm() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 1500)
        })
      }
    })
  }

  function handlePromptClick() {
    prompt({
      title: '消息',
      content: '请填写一个有效的链接地址',
      inputType: 'url',
      inputValue: 'https://baidu.com',
      validate(value) {
        try {
          new URL(value)
        } catch (error) {
          return 'URL格式不正确'
        }
      },
      async onConfirm(value) {
        await new Promise<void>(resolve => {
          setTimeout(() => {
            resolve()
          }, 1500)
        })
        enqueueSnackbar(`URL: ${value}`, { variant: 'success' })
      }
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Box sx={{ width: 300, display: 'inline-block' }}>
        <ToggleButtonGroup value={colorMode} color="primary" exclusive fullWidth size="small" onChange={handleColorModeChange}>
          <ToggleButton value="system" disableRipple>
            <SettingsBrightnessRounded sx={{ fontSize: '1em', mr: 1 }} />
            系统默认
          </ToggleButton>
          <ToggleButton value="light" disableRipple>
            <LightModeRounded sx={{ fontSize: '1em', mr: 1 }} />
            亮色
          </ToggleButton>
          <ToggleButton value="dark" disableRipple>
            <DarkModeRounded sx={{ fontSize: '1em', mr: 1 }} />
            深色
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Typography variant="h6">Info</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" disableElevation onClick={() => handleInfoClick()}>
            Default
          </Button>
          {types.map(type => (
            <Button key={type} variant="contained" color={type} disableElevation onClick={() => handleInfoClick(type)}>
              {type}
            </Button>
          ))}
          <Button variant="contained" disableElevation onClick={() => handleInfoClick(undefined, icon)}>
            Custom Icon
          </Button>
        </Box>
        <Typography variant="h6">Confirm</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" disableElevation onClick={() => handleConfirmClick()}>
            Default
          </Button>
          {types.map(type => (
            <Button key={type} variant="contained" color={type} disableElevation onClick={() => handleConfirmClick(type)}>
              {type}
            </Button>
          ))}
          <Button variant="contained" disableElevation onClick={() => handleInfoClick(undefined, icon)}>
            Custom Icon
          </Button>
        </Box>
        <Typography variant="h6">Prompt</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" disableElevation onClick={handlePromptClick}>
            Url
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
