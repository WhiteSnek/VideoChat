import { Outlet } from "react-router-dom";
import SocketProvider from "./providers/SocketProvider";
import PeerProvider from "./providers/Peer";
function App() {
  return (
    <SocketProvider>
      <PeerProvider>
      <Outlet />
      </PeerProvider>
    </SocketProvider>
  );
}

export default App;
