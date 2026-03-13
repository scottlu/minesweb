import { formatLed } from '../../utils/format';
import '../../styles/led.css';

interface LedDisplayProps {
  value: number;
  onClick?: () => void;
}

export function LedDisplay({ value, onClick }: LedDisplayProps) {
  return (
    <div className="led-display" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <span className="led-shadow">888</span>
      <span className="led-value">{formatLed(value)}</span>
    </div>
  );
}
