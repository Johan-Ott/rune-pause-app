<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import ConfigView from './lib/components/ConfigView.svelte';
  import PauseView from './lib/components/PauseView.svelte';
  import type { AppSettings, AppMode } from './lib/types';
  import { settingsStore, modeStore } from './lib/stores/appStore';
  import './nordic.css';

  let currentMode: AppMode = 'config';
  let settings: AppSettings;

  // Subscribe to stores
  modeStore.subscribe(mode => {
    currentMode = mode;
  });

  settingsStore.subscribe(s => {
    settings = s;
  });

  // Handle URL routing
  onMount(() => {
    const hash = window.location.hash;
    if (hash.includes('#config')) {
      modeStore.set('config');
    } else if (hash.includes('#pause')) {
      modeStore.set('pause');
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash;
      if (newHash.includes('#config')) {
        modeStore.set('config');
      } else if (newHash.includes('#pause')) {
        modeStore.set('pause');
      }
    });
  });
</script>

<main class="app-container">
  {#if currentMode === 'config'}
    <ConfigView />
  {:else if currentMode === 'pause'}
    <PauseView />
  {/if}
</main>

<style>
  .app-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>
