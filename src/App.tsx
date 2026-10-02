import { useSnakeGame, Difficulty } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import TouchControls from './components/TouchControls';
import { useEffect, useRef, useCallback } from 'react';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  hard: 'bg-red-100 text-red-700 border-red-300',
};

export default function App() {
  const {
    snake,
    food,
    direction,
    gameState,
    score,
    highScore,
    difficulty,
    gridSize,
    setDifficulty,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
  } = useSnakeGame();

  // Swipe detection for mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipe) {
        changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > minSwipe) {
        changeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  }, [changeDirection]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col items-center justify-start py-4 px-4 sm:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
          🐍 Snake Game
        </h1>
        <p className="text-slate-500 text-sm mt-1">Jogo da Cobrinha</p>
      </div>

      {/* Score Panel */}
      <div className="w-full max-w-md mb-4">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-sm border border-slate-100">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Pontuação</p>
            <p className="text-2xl font-bold text-slate-800">{score}</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Recorde</p>
            <p className="text-2xl font-bold text-emerald-600">{highScore}</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Tamanho</p>
            <p className="text-2xl font-bold text-slate-600">{snake.length}</p>
          </div>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 font-medium mr-1">Dificuldade:</span>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              if (gameState === 'idle' || gameState === 'gameover') {
                setDifficulty(d);
              }
            }}
            disabled={gameState === 'playing' || gameState === 'paused'}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
              difficulty === d
                ? `${DIFFICULTY_COLORS[d]} shadow-sm scale-105`
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Game Board Container */}
      <div className="w-full max-w-md relative">
        <GameBoard
          snake={snake}
          food={food}
          direction={direction}
          gridSize={gridSize}
        />

        {/* Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 animate-fade-in">
            <div className="text-5xl mb-4">🐍</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Pronto para jogar?</h2>
            <p className="text-sm text-slate-500 mb-4">
              Use as setas ou WASD para mover
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              ▶ Iniciar Jogo
            </button>
            <p className="text-xs text-slate-400 mt-3">ou pressione Espaço</p>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 animate-fade-in">
            <div className="text-4xl mb-3">⏸️</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Pausado</h2>
            <button
              onClick={togglePause}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              ▶ Continuar
            </button>
            <p className="text-xs text-slate-400 mt-3">ou pressione Espaço / Esc</p>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20 animate-fade-in">
            <div className="text-4xl mb-3">💀</div>
            <h2 className="text-xl font-bold text-slate-700 mb-1">Fim de Jogo!</h2>
            <p className="text-3xl font-bold text-emerald-600 mb-1">{score} pts</p>
            {score >= highScore && score > 0 && (
              <p className="text-sm text-amber-500 font-semibold mb-2 animate-bounce">
                🏆 Novo Recorde!
              </p>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mt-2"
            >
              🔄 Jogar Novamente
            </button>
            <p className="text-xs text-slate-400 mt-3">ou pressione Espaço</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        {gameState === 'playing' && (
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all duration-200 hover:scale-105"
          >
            ⏸ Pausar
          </button>
        )}
        {(gameState === 'playing' || gameState === 'paused') && (
          <button
            onClick={() => {
              resetGame();
            }}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all duration-200 hover:scale-105"
          >
            🔄 Reiniciar
          </button>
        )}
      </div>

      {/* Touch Controls */}
      <TouchControls
        onDirectionChange={changeDirection}
        disabled={gameState !== 'playing'}
      />

      {/* Instructions */}
      <div className="mt-6 text-center hidden sm:block">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl px-5 py-3 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500 font-medium mb-2">Controles</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">↑↓←→</kbd> Mover
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Espaço</kbd> Pausar
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Esc</kbd> Pausar
            </span>
          </div>
        </div>
      </div>

      {/* Mobile instructions */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-xs text-slate-400">
          Deslize na tela ou use os botões para controlar
        </p>
      </div>
    </div>
  );
}
