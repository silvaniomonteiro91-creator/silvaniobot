import { Position, Direction } from '../hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  direction: Direction;
  gridSize: number;
}

export default function GameBoard({ snake, food, direction, gridSize }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  const getRotation = (dir: Direction) => {
    switch (dir) {
      case 'UP': return -90;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
      case 'RIGHT': return 0;
    }
  };

  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-200">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #64748b 1px, transparent 1px),
            linear-gradient(to bottom, #64748b 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}% ${cellSize}%`,
        }}
      />

      {/* Food */}
      <div
        className="absolute transition-all duration-200 ease-out flex items-center justify-center"
        style={{
          left: `${food.x * cellSize}%`,
          top: `${food.y * cellSize}%`,
          width: `${cellSize}%`,
          height: `${cellSize}%`,
        }}
      >
        <div className="w-[80%] h-[80%] rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg animate-pulse flex items-center justify-center">
          <span className="text-[0.5rem] sm:text-xs">🍎</span>
        </div>
      </div>

      {/* Snake */}
      {snake.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === snake.length - 1;
        const opacity = 1 - (index / snake.length) * 0.4;

        return (
          <div
            key={index}
            className={`absolute transition-all duration-[80ms] ease-linear ${
              isHead ? 'z-10' : 'z-5'
            }`}
            style={{
              left: `${segment.x * cellSize}%`,
              top: `${segment.y * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
              padding: '1px',
            }}
          >
            <div
              className={`w-full h-full ${
                isHead
                  ? 'bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg shadow-lg'
                  : isTail
                  ? 'bg-gradient-to-br from-emerald-300 to-green-500 rounded-full'
                  : 'bg-gradient-to-br from-emerald-400 to-green-500 rounded-md'
              }`}
              style={{
                opacity,
                transform: isHead ? `rotate(${getRotation(direction)}deg)` : undefined,
              }}
            >
              {isHead && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex gap-[2px]">
                    <div className="w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full bg-white shadow-sm" />
                    <div className="w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
