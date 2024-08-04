import { useState } from 'react'
import Header from '../components/Header.jsx'
import CardPanel from '../components/CardPanel.jsx'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Header/>
        <CardPanel/>
    </>
  )
}

export default Home