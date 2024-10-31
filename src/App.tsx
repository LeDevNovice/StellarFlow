import { useContext, useEffect, useRef, useState } from 'react';

import TransitionAnimation from './components/TransitionAnimation/TransitionAnimation';
import GameContainer from './components/GameContainer/GameContainer';
import HelpScreen from './components/HelpScreen/HelpScreen';
import HomeScreen from './components/HomeScreen/HomeScreen';
import LevelSelection from './components/LevelSelection/LevelSelection';
import { GameContext, GameProvider } from './context/GameProvider';
import { Level } from './models/level.model';

import menuMusicFile from './assets/audio/menuMusic.mp3'
import gameMusicFile from './assets/audio/gameMusic.wav';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'level-selection' | 'help' | 'playing'>('home');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextScreen, setNextScreen] = useState<'home' | 'level-selection' | 'help' | 'playing'>('home');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);

  const gameContext = useContext(GameContext);

  const menuAudioRef = useRef<HTMLAudioElement>(new Audio(menuMusicFile));
  const gameAudioRef = useRef<HTMLAudioElement>(new Audio(gameMusicFile));

  useEffect(() => {
    menuAudioRef.current.loop = true;
    menuAudioRef.current.volume = 1;
    menuAudioRef.current.autoplay = true

    menuAudioRef.current.play().catch((error) => {
      console.error('Erreur lors de la lecture de la musique de menu:', error);
    });

    gameAudioRef.current.loop = true;
    gameAudioRef.current.volume = 0.5;
    gameAudioRef.current.pause();

    return () => {
      menuAudioRef.current.pause();
      gameAudioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    const { gameState } = gameContext || {};
    const isMenuScreen = ['home', 'level-selection', 'help'].includes(currentScreen);
    const isGamePlaying = currentScreen === 'playing' && gameState === 'playing';
    const isGameCompleted = currentScreen === 'playing' && gameState === 'completed';

    if (isMenuScreen || isGameCompleted) {
      if (menuAudioRef.current.paused) {
        menuAudioRef.current.play().catch((error) => {
          console.error('Erreur lors de la lecture de la musique de menu:', error);
        });
      }

      if (!gameAudioRef.current.paused) {
        gameAudioRef.current.pause();
        gameAudioRef.current.currentTime = 0;
      }
    }

    if (isGamePlaying) {
      if (gameAudioRef.current.paused) {
        gameAudioRef.current.play().catch((error) => {
          console.error('Erreur lors de la lecture de la musique de jeu:', error);
        });
      }

      if (!menuAudioRef.current.paused) {
        menuAudioRef.current.pause();
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
    if (gameAudioRef.current.paused) {
      gameAudioRef.current.play().catch((error) => {
        console.error('Erreur lors de la lecture de la musique de jeu:', error);
      });
    }

    if (!menuAudioRef.current.paused) {
      menuAudioRef.current.pause();
    }

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
