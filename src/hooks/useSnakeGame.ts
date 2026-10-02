import { useState, useCallback, useEffect, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;

const SPEED_MAP: Record<Difficulty, number> = {
  easy: 150,
  medium: 100,
  hard: 60,
};

function getRandomPosition(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
  return pos;
}

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>('RIGHT');

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPosition(INITIAL_SNAKE));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    lastDirectionRef.current = 'RIGHT';
    setScore(0);
    setGameState('idle');
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposites[newDir] !== lastDirectionRef.current) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const dir = directionRef.current;
      lastDirectionRef.current = dir;

      let newHead: Position;
      switch (dir) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameState('gameover');
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameState('gameover');
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      setFood(prevFood => {
        if (newHead.x === prevFood.x && newHead.y === prevFood.y) {
          setScore(prev => {
            const newScore = prev + 10;
            setHighScore(currentHigh => {
              if (newScore > currentHigh) {
                localStorage.setItem('snake-high-score', String(newScore));
                return newScore;
              }
              return currentHigh;
            });
            return newScore;
          });
          return getRandomPosition(newSnake);
        }
        newSnake.pop();
        return prevFood;
      });

      return newSnake;
    });
  }, []);

  const startGame = useCallback(() => {
    if (gameState === 'gameover') {
      resetGame();
      setTimeout(() => {
        setGameState('playing');
      }, 50);
      return;
    }
    setGameState('playing');
  }, [gameState, resetGame]);

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      pauseGame();
    } else if (gameState === 'paused') {
      resumeGame();
    }
  }, [gameState, pauseGame, resumeGame]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      const speed = SPEED_MAP[difficulty];
      gameLoopRef.current = window.setInterval(moveSnake, speed);
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
      };
    }
  }, [gameState, difficulty, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameState === 'idle' || gameState === 'gameover') {
            startGame();
          } else {
            togglePause();
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (gameState === 'playing' || gameState === 'paused') {
            togglePause();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, gameState, startGame, togglePause]);

  return {
    snake,
    food,
    direction,
    gameState,
    score,
    highScore,
    difficulty,
    gridSize: GRID_SIZE,
    setDifficulty,
    startGame,
    pauseGame,
    resumeGame,
    togglePause,
    resetGame,
    changeDirection,
  };
}
