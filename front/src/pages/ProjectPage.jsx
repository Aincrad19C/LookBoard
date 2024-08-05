import { useState } from 'react'

import Header from '../components/Header.jsx'
import Projects from '../components/Projects.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Header/>
        <Projects/>
    </>
  )
}

export default App