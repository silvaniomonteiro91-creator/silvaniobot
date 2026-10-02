import { Direction } from '../hooks/useSnakeGame';

interface TouchControlsProps {
  onDirectionChange: (dir: Direction) => void;
  disabled?: boolean;
}

export default function TouchControls({ onDirectionChange, disabled }: TouchControlsProps) {
  const handleTouch = (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onDirectionChange(dir);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-48 mx-auto mt-4 sm:hidden">
      <div />
      <button
        onTouchStart={handleTouch('UP')}
        onMouseDown={handleTouch('UP')}
        className="aspect-square bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 flex items-center justify-center active:scale-90 active:bg-emerald-50 transition-all duration-100 touch-manipulation"
        aria-label="Mover para cima"
      >
        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <div />

      <button
        onTouchStart={handleTouch('LEFT')}
        onMouseDown={handleTouch('LEFT')}
        className="aspect-square bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 flex items-center justify-center active:scale-90 active:bg-emerald-50 transition-all duration-100 touch-manipulation"
        aria-label="Mover para esquerda"
      >
        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="aspect-square bg-slate-100/50 rounded-xl border border-slate-200/50 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-slate-300" />
      </div>

      <button
        onTouchStart={handleTouch('RIGHT')}
        onMouseDown={handleTouch('RIGHT')}
        className="aspect-square bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 flex items-center justify-center active:scale-90 active:bg-emerald-50 transition-all duration-100 touch-manipulation"
        aria-label="Mover para direita"
      >
        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div />
      <button
        onTouchStart={handleTouch('DOWN')}
        onMouseDown={handleTouch('DOWN')}
        className="aspect-square bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-slate-200 flex items-center justify-center active:scale-90 active:bg-emerald-50 transition-all duration-100 touch-manipulation"
        aria-label="Mover para baixo"
      >
        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div />
    </div>
  );
}
