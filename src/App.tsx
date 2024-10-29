import { useState } from "react";

import TransitionAnimation from './components/TransitionAnimation/TransitionAnimation';
import GameContainer from './components/GameContainer/GameContainer';
import HelpScreen from './components/HelpScreen/HelpScreen';
import HomeScreen from './components/HomeScreen/HomeScreen';
import { GameProvider } from './context/GameProvider';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'levels' | 'help' | 'playing'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextScreen, setNextScreen] = useState<'home' | 'levels' | 'help' | 'playing'>('home');

  const handlePlay = () => {
    setNextScreen('levels');
    setIsTransitioning(true);
  };

  const handleHelp = () => {
    setNextScreen('help');
    setIsTransitioning(true);
  };

  const handleBackToHome = () => {
    setNextScreen('home');
    setIsTransitioning(true);
  };

  const handleRestartGame = () => {
    setNextScreen('levels');
    setIsTransitioning(true);
  };

  const handleAnimationHalfway = () => {
    setCurrentScreen(nextScreen);
  };

  const handleAnimationEnd = () => {
    setIsTransitioning(false);
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
      {isTransitioning && (
        <TransitionAnimation
          onHalfway={handleAnimationHalfway}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
    </GameProvider>
  )
}

export default App
