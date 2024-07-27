import React, { createContext, useContext, useMemo } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => {
    return useContext(SocketContext)
}

const SocketProvider = (props) => {
    const socket = useMemo(
        () => io(
            import.meta.env.VITE_SOCKET_SERVER
        ),
        []
    )
  return (
    <SocketContext.Provider value={{socket}}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
