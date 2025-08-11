import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TimerDisplay from '../src/components/TimerDisplay.svelte';
import type { TimerState } from '$types';

describe('TimerDisplay', () => {
  const mockTimerState: TimerState = {
    phase: 'Focus',
    seconds_left: 1500, // 25 minutes
    cycle: 1,
  };

  it('renders timer state correctly', () => {
    render(TimerDisplay, { props: { timerState: mockTimerState } });
    
    expect(screen.getByText('Fokus')).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getByText('Cykel 1')).toBeInTheDocument();
  });

  it('shows idle state', () => {
    const idleState: TimerState = {
      phase: 'Idle',
      seconds_left: 0,
      cycle: 0,
    };

    render(TimerDisplay, { props: { timerState: idleState } });
    
    expect(screen.getByText('Vilar')).toBeInTheDocument();
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    const shortState: TimerState = {
      phase: 'Break',
      seconds_left: 65, // 1:05
      cycle: 1,
    };

    render(TimerDisplay, { props: { timerState: shortState } });
    
    expect(screen.getByText('1:05')).toBeInTheDocument();
  });
});
