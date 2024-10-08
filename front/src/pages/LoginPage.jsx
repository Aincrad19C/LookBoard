import { useState } from 'react'
import Title from '../components/Title.jsx'
import Login from '../components/Login.jsx'
import Wave from '../components/Wave.jsx'
import Background from '../components/ImageCarousel.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Background/>
        <Title/>
        <Login/>
        <Wave/>
    </>
  )
}

export default App