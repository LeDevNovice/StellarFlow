import { useState } from "react";

import GameContainer from "./components/GameContainer/GameContainer"
import HomeScreen from "./components/HomeScreen/HomeScreen";
import { GameProvider } from "./context/GameProvider"

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'levels' | 'help' | 'playing'>('home');

  const handlePlay = () => {
    setCurrentScreen('levels');
  };

  const handleHelp = () => {
    setCurrentScreen('help');
  };

  return (
    <GameProvider>
      {currentScreen === 'home' && <HomeScreen onPlay={handlePlay} onHelp={handleHelp} />}
      <GameContainer />
    </GameProvider>
  )
}

export default App
