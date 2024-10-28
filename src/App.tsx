import GameContainer from "./components/GameContainer/GameContainer"
import { GameProvider } from "./context/GameProvider"

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  )
}

export default App
