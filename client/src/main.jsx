import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CreateRoom from './pages/CreateRoom.jsx'

const Layout = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<App />}>
        <Route path='/room/:roomId' element={<Home />} />
        <Route path='' element={<CreateRoom />}/>
      </Route>
    )
  )
  return (
    <RouterProvider router={router} />
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,
)
