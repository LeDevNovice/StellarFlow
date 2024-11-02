import { useContext, useEffect, useRef, useState } from 'react';

import TransitionAnimation from './components/TransitionAnimation/TransitionAnimation';
import GameContainer from './components/GameContainer/GameContainer';
import HelpScreen from './components/HelpScreen/HelpScreen';
import HomeScreen from './components/HomeScreen/HomeScreen';
import LevelSelection from './components/LevelSelection/LevelSelection';
import { GameContext, GameProvider } from './context/GameProvider';
import { Level } from './models/level.model';

import menuMusicFile from './assets/audio/menuMusic.mp3'

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'level-selection' | 'help' | 'playing'>('home');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextScreen, setNextScreen] = useState<'home' | 'level-selection' | 'help' | 'playing'>('home');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);

  const gameContext = useContext(GameContext);

  const menuAudioRef = useRef<HTMLAudioElement>(new Audio(menuMusicFile));

  useEffect(() => {
    menuAudioRef.current.loop = true;
    menuAudioRef.current.volume = 1;

    return () => {
      menuAudioRef.current.pause();
    };
  }, []);

  // Function to start menu audio
  const startMenuAudio = () => {
    menuAudioRef.current.play().catch((error) => {
      console.error('Erreur lors de la lecture de la musique de menu:', error);
    });
  };

  useEffect(() => {
    const isMenuScreen = ['home', 'level-selection', 'help'].includes(currentScreen);

    if (isMenuScreen) {
      if (menuAudioRef.current.paused) {
        menuAudioRef.current.play().catch((error) => {
          console.error('Erreur lors de la lecture de la musique de menu:', error);
        });
      }
    }
  }, [currentScreen, gameContext?.gameState]);

  const handlePlay = () => {
    setNextScreen('level-selection');
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

  const handleStartGame = (level: Level, difficulty: number) => {
    menuAudioRef.current.pause();
    menuAudioRef.current.currentTime = 0;
    menuAudioRef.current.volume = 0.5;

    setSelectedLevel(level);
    setSelectedDifficulty(difficulty);
    setNextScreen('playing');
    setIsTransitioning(true); 

    setTimeout(() => {
      menuAudioRef.current.play().catch((error) => {
        console.error('Erreur lors de la lecture de la musique:', error);
      });
    }, 2000);
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
      {currentScreen === 'home' && (
        <HomeScreen 
          onPlay={handlePlay} 
          onHelp={handleHelp} 
          startMenuAudio={startMenuAudio}
        />
      )}
      {currentScreen === 'help' && <HelpScreen onBack={handleBackToHome} />}
      {currentScreen === 'level-selection' && <LevelSelection onStartGame={handleStartGame} onBack={handleBackToHome} />}
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
