import { useCallback, useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  const handleButtonClick = useCallback(() => {
    setCount(count => count + 1)
  }, [])

  return <button onClick={handleButtonClick}>{count}</button>
}
