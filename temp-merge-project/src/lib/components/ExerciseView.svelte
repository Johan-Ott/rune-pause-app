<script lang="ts">
  import type { Exercise } from '../data/exercises.js';
  import { currentLanguage, t } from '../i18n/language.js';
  import { soundManager } from '../audio/SoundManager.js';

  export let exercise: Exercise;
  export let onComplete: () => void = () => {};
  export let onSkip: () => void = () => {};

  let currentStep = 0;
  let timeRemaining = exercise.duration;
  let isRunning = false;
  let interval: NodeJS.Timeout | null = null;
  
  $: translations = $t;
  $: currentLang = $currentLanguage;
  $: instructions = exercise.instructions[currentLang] || exercise.instructions.sv || [];
  $: exerciseName = exercise.name[currentLang] || exercise.name.sv;
  $: exerciseDescription = exercise.description[currentLang] || exercise.description.sv;

  function startExercise() {
    isRunning = true;
    soundManager.playBreakStart();
    
    interval = setInterval(() => {
      timeRemaining--;
      if (timeRemaining <= 0) {
        completeExercise();
      }
    }, 1000);
  }

  function pauseExercise() {
    isRunning = false;
    if (interval) {
      clearInterval(interval);
    }
  }

  function completeExercise() {
    isRunning = false;
    if (interval) {
      clearInterval(interval);
    }
    soundManager.playBreakEnd();
    onComplete();
  }

  function skipExercise() {
    isRunning = false;
    if (interval) {
      clearInterval(interval);
    }
    onSkip();
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'easy': return '#4ade80';
      case 'medium': return '#fbbf24'; 
      case 'hard': return '#f87171';
      default: return '#4ade80';
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'physical': return '🤸';
      case 'mental': return '🧠';
      case 'visual': return '👁️';
      case 'breathing': return '🌬️';
      default: return '✨';
    }
  }

  function nextStep() {
    if (currentStep < instructions.length - 1) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }
</script>

<div class="exercise-container">
  <div class="exercise-header">
    <div class="exercise-info">
      <h2 class="exercise-title">
        <span class="exercise-icon">{getTypeIcon(exercise.type)}</span>
        {exerciseName}
      </h2>
      <p class="exercise-description">{exerciseDescription}</p>
      <div class="exercise-meta">
        <span class="exercise-duration">
          {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
        </span>
        <span 
          class="exercise-difficulty"
          style="color: {getDifficultyColor(exercise.difficulty)}"
        >
          {translations[exercise.difficulty]}
        </span>
      </div>
    </div>
    
    <div class="timer-circle">
      <svg viewBox="0 0 100 100" class="timer-svg">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(79, 172, 254, 0.2)"
          stroke-width="4"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#4facfe"
          stroke-width="4"
          stroke-dasharray="283"
          stroke-dashoffset={283 * (timeRemaining / exercise.duration)}
          stroke-linecap="round"
          transform="rotate(-90 50 50)"
          class="timer-progress"
        />
      </svg>
      <div class="timer-text">{formatTime(timeRemaining)}</div>
    </div>
  </div>

  <div class="exercise-instructions">
    <div class="instruction-step">
      <div class="step-indicator">
        <span class="step-number">{currentStep + 1}</span>
        <span class="step-total">/ {instructions.length}</span>
      </div>
      <p class="instruction-text">{instructions[currentStep]}</p>
    </div>

    <div class="step-navigation">
      <button 
        class="step-btn prev-btn" 
        on:click={prevStep}
        disabled={currentStep === 0}
      >
        ←
      </button>
      <button 
        class="step-btn next-btn" 
        on:click={nextStep}
        disabled={currentStep === instructions.length - 1}
      >
        →
      </button>
    </div>
  </div>

  <div class="exercise-controls">
    {#if !isRunning && timeRemaining === exercise.duration}
      <button class="control-btn start-btn" on:click={startExercise}>
        <span class="btn-icon">▶️</span>
        {translations.startBreak}
      </button>
    {:else if isRunning}
      <button class="control-btn pause-btn" on:click={pauseExercise}>
        <span class="btn-icon">⏸️</span>
        {translations.pause}
      </button>
    {:else}
      <button class="control-btn resume-btn" on:click={startExercise}>
        <span class="btn-icon">▶️</span>
        {translations.resume}
      </button>
    {/if}
    
    <button class="control-btn skip-btn" on:click={skipExercise}>
      <span class="btn-icon">⏭️</span>
      {translations.skip}
    </button>
  </div>
</div>

<style>
  .exercise-container {
    background: linear-gradient(140deg, #1a1d4a 0%, #2c3968 30%, #1e2559 70%, #1a1d4a 100%);
    border-radius: 24px;
    border: 1px solid rgba(79, 172, 254, 0.15);
    backdrop-filter: blur(20px);
    padding: 32px;
    color: white;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-width: 480px;
    margin: 0 auto;
  }

  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    gap: 24px;
  }

  .exercise-info {
    flex: 1;
  }

  .exercise-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
  }

  .exercise-icon {
    font-size: 1.8rem;
  }

  .exercise-description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 16px 0;
    line-height: 1.4;
  }

  .exercise-meta {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .exercise-duration {
    color: #4facfe;
  }

  .timer-circle {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .timer-svg {
    width: 100%;
    height: 100%;
  }

  .timer-progress {
    transition: stroke-dashoffset 1s ease;
  }

  .timer-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    font-weight: 600;
    color: #4facfe;
  }

  .exercise-instructions {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 24px;
    margin-bottom: 24px;
  }

  .instruction-step {
    margin-bottom: 20px;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
  }

  .step-number {
    font-weight: 600;
    color: #4facfe;
    font-size: 1.1rem;
  }

  .step-total {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }

  .instruction-text {
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
  }

  .step-navigation {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .step-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(79, 172, 254, 0.3);
    background: rgba(79, 172, 254, 0.1);
    color: #4facfe;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .step-btn:hover:not(:disabled) {
    background: rgba(79, 172, 254, 0.2);
    transform: scale(1.1);
  }

  .step-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .exercise-controls {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .control-btn {
    padding: 12px 24px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    min-width: 120px;
    justify-content: center;
  }

  .start-btn, .resume-btn {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
  }

  .pause-btn {
    background: rgba(251, 191, 36, 0.2);
    border: 1px solid rgba(251, 191, 36, 0.3);
    color: #fbbf24;
  }

  .skip-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
  }

  .control-btn:hover {
    transform: translateY(-2px);
  }

  .start-btn:hover, .resume-btn:hover {
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  }

  .btn-icon {
    font-size: 1rem;
  }
</style>
