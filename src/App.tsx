import { useState } from "react";

import GameContainer from "./components/GameContainer/GameContainer"
import HomeScreen from "./components/HomeScreen/HomeScreen";
import { GameProvider } from "./context/GameProvider"
import HelpScreen from "./components/HelpScreen/HelpScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'levels' | 'help' | 'playing'>('home');

  const handlePlay = () => {
    setCurrentScreen('levels');
  };

  const handleHelp = () => {
    setCurrentScreen('help');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleRestartGame = () => {
    setCurrentScreen('levels');
  };

  return (
    <GameProvider>
      {currentScreen === 'home' && <HomeScreen onPlay={handlePlay} onHelp={handleHelp} />}
      {currentScreen === 'help' && <HelpScreen onBack={handleBackToHome} />}
      {currentScreen === 'levels' && (
        <GameContainer
          onBackToHome={handleBackToHome}
          onRestartGame={handleRestartGame}
        />
      )}
    </GameProvider>
  )
}

export default App
