import { useState } from 'react'
import reactLogo from './assets/react.svg'

import './App.css'
import KanbanBoard from './components/KanbanBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App"> 
    
      <KanbanBoard />

    </div>
  )
}

export default App
