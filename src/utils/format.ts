export function formatLed(value: number): string {
  const clamped = Math.max(0, Math.min(999, Math.floor(value)));
  return clamped.toString().padStart(3, '0');
}
