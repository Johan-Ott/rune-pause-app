<script lang="ts">
  import Button from './Button.svelte';
  import { TimerAPI } from '$lib';
  import { isRunning } from '$stores';

  // eslint-disable-next-line prefer-const
  let loading = {
    start: false,
    stop: false,
    snooze: false,
  };

  async function handleStart(): Promise<void> {
    loading.start = true;
    try {
      await TimerAPI.start();
      isRunning.set(true);
    } catch (error) {
      console.error('Failed to start timer:', error);
    } finally {
      loading.start = false;
    }
  }

  async function handleStop(): Promise<void> {
    loading.stop = true;
    try {
      await TimerAPI.stop();
      isRunning.set(false);
    } catch (error) {
      console.error('Failed to stop timer:', error);
    } finally {
      loading.stop = false;
    }
  }

  async function handleSnooze(): Promise<void> {
    loading.snooze = true;
    try {
      await TimerAPI.snooze();
    } catch (error) {
      console.error('Failed to snooze timer:', error);
    } finally {
      loading.snooze = false;
    }
  }
</script>

<div class="timer-controls">
  <Button
    variant="primary"
    size="lg"
    loading={loading.start}
    disabled={$isRunning}
    on:click={handleStart}
  >
    ▶️ Starta
  </Button>

  <Button
    variant="secondary"
    size="lg"
    loading={loading.stop}
    disabled={!$isRunning}
    on:click={handleStop}
  >
    ⏹️ Stoppa
  </Button>

  <Button variant="ghost" size="lg" loading={loading.snooze} on:click={handleSnooze}>
    ⏰ Snooze
  </Button>
</div>

<style>
  .timer-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    .timer-controls {
      grid-template-columns: 1fr;
    }
  }
</style>
