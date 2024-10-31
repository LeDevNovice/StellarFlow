import { useContext, useState } from 'react';

import TransitionAnimation from './components/TransitionAnimation/TransitionAnimation';
import GameContainer from './components/GameContainer/GameContainer';
import HelpScreen from './components/HelpScreen/HelpScreen';
import HomeScreen from './components/HomeScreen/HomeScreen';
import LevelSelection from './components/LevelSelection/LevelSelection';
import { GameContext, GameProvider } from './context/GameProvider';
import { Level } from './models/level.model';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'level-selection' | 'help' | 'playing'>('home');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextScreen, setNextScreen] = useState<'home' | 'level-selection' | 'help' | 'playing'>('home');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);

  const gameContext = useContext(GameContext); // Accès au contexte

  const handlePlay = () => {
    // setCurrentScreen('level-selection');
    setNextScreen('level-selection');
    setIsTransitioning(true);
  };

  const handleHelp = () => {
    // setCurrentScreen('help');
    setNextScreen('help');
    setIsTransitioning(true);
  };

  const handleBackToHome = () => {
    // setCurrentScreen('home');
    setNextScreen('home');
    setIsTransitioning(true);
  };

  const handleStartGame = (level: Level, difficulty: number) => {
    setSelectedLevel(level);
    setSelectedDifficulty(difficulty);
    setNextScreen('playing');
    setIsTransitioning(true); 
  };

  const handleRestartGame = () => {
    gameContext?.resetGameState();
    setCurrentScreen('playing');
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
      {currentScreen === 'level-selection' && <LevelSelection onStartGame={handleStartGame} />}
      {currentScreen === 'playing' && selectedLevel && (
        <GameContainer
          level={selectedLevel}
          difficulty={selectedDifficulty}
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
  );
}

export default App;
