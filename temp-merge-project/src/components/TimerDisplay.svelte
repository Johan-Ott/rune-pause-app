<script lang="ts">
  import type { TimerState } from '$types';
  import { formatTime, getPhaseDisplayName } from '$utils';

  export let timerState: TimerState;
  export let locale = 'sv';

  $: phaseDisplay = getPhaseDisplayName(timerState.phase, locale);
  $: timeDisplay = formatTime(timerState.seconds_left);
  $: isActive = timerState.phase !== 'Idle';
</script>

<div class="timer-display" class:timer-display--active={isActive}>
  <div class="timer-display__phase">
    {phaseDisplay}
  </div>

  <div class="timer-display__time">
    {timeDisplay}
  </div>

  <div class="timer-display__cycle">
    Cykel {timerState.cycle}
  </div>

  <div class="timer-display__progress">
    <div
      class="timer-display__progress-bar"
      style="--progress: {isActive ? (1 - timerState.seconds_left / (25 * 60)) * 100 : 0}%"
    />
  </div>
</div>

<style>
  .timer-display {
    text-align: center;
    padding: 2rem;
    border-radius: 1rem;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    transition: all 0.3s ease;
  }

  .timer-display--active {
    background: var(--color-primary);
    color: var(--color-primary-foreground);
    box-shadow: 0 0 30px var(--color-primary-shadow);
  }

  .timer-display__phase {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .timer-display__time {
    font-size: 3rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .timer-display__cycle {
    font-size: 1rem;
    opacity: 0.8;
    margin-bottom: 1.5rem;
  }

  .timer-display__progress {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }

  .timer-display__progress-bar {
    width: var(--progress);
    height: 100%;
    background: currentColor;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  @media (max-width: 480px) {
    .timer-display__time {
      font-size: 2.5rem;
    }
  }
</style>
