<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'secondary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let loading = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';

  $: classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled && 'btn--disabled',
    loading && 'btn--loading',
  ]
    .filter(Boolean)
    .join(' ');
</script>

<button {type} class={classes} {disabled} on:click on:focus on:blur {...$$restProps}>
  {#if loading}
    <span class="btn__spinner" />
  {/if}
  <slot />
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    user-select: none;
  }

  .btn:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .btn--sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn--md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .btn--lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  .btn--primary {
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
  }

  .btn--primary:hover:not(.btn--disabled) {
    background-color: var(--color-primary-hover);
  }

  .btn--secondary {
    background-color: var(--color-secondary);
    color: var(--color-secondary-foreground);
    border: 1px solid var(--color-border);
  }

  .btn--secondary:hover:not(.btn--disabled) {
    background-color: var(--color-secondary-hover);
  }

  .btn--danger {
    background-color: var(--color-danger);
    color: var(--color-danger-foreground);
  }

  .btn--danger:hover:not(.btn--disabled) {
    background-color: var(--color-danger-hover);
  }

  .btn--ghost {
    background-color: transparent;
    color: var(--color-foreground);
  }

  .btn--ghost:hover:not(.btn--disabled) {
    background-color: var(--color-secondary);
  }

  .btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn--loading {
    cursor: wait;
  }

  .btn__spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
