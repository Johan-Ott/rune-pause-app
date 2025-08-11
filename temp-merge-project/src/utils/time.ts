/**
 * Format seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

/**
 * Format duration in a human-readable way
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Get the display name for a timer phase
 */
export function getPhaseDisplayName(phase: string, locale = 'sv'): string {
  const translations = {
    en: {
      Idle: 'Idle',
      Focus: 'Focus',
      Break: 'Break',
      MicroBreak: 'Micro Break',
    },
    sv: {
      Idle: 'Vilar',
      Focus: 'Fokus',
      Break: 'Paus',
      MicroBreak: 'Mikropaus',
    },
  };

  return (
    translations[locale as keyof typeof translations]?.[phase as keyof typeof translations.en] ??
    phase
  );
}
