// import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home'
import Room from './Room'
import Search from './Search'
import Setting from './Setting'

export const basename = '/ichigoichie';

export default function App() {
  // const [count, setCount] = useState(0)
  const [cookies] = useCookies(['setting']);

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path="/:roomName/setting" element={<Setting />} /> */}
        <Route path="/:roomName" element={<Room view={Search} />} />
        <Route path="/:roomName/setting" element={<Room view={Setting} />} />
        {/* <Route path="/:roomName" element={cookies.setting ? <Room /> : <Navigate to="setting" />} /> */}
      </Routes>
    </BrowserRouter>
    // <>
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  )
}
