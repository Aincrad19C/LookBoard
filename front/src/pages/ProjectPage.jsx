import { useState } from 'react'

import Wave from '../components/Wave.jsx'
import Header from '../components/Header.jsx'
import Projects from '../components/Projects.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Header/>
        <Projects/>
        <Wave/>
    </>
  )
}

export default App