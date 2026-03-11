import { formatLed } from '../../utils/format';
import '../../styles/led.css';

interface LedDisplayProps {
  value: number;
}

export function LedDisplay({ value }: LedDisplayProps) {
  return (
    <div className="led-display">
      <span className="led-shadow">888</span>
      <span className="led-value">{formatLed(value)}</span>
    </div>
  );
}
