import { Button } from '@mui/material'
import { useCallback, useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  const handleButtonClick = useCallback(() => {
    setCount(count => count + 1)
  }, [])

  return (
    <Button variant="contained" disableElevation onClick={handleButtonClick}>
      {count}
    </Button>
  )
}
