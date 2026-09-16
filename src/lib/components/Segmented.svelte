<script lang="ts" generics="T extends string | number">
  let {
    options,
    value = $bindable(),
    label,
    onchange,
  }: { options: { value: T; label: string }[]; value: T; label: string; onchange?: (value: T) => void } = $props();
</script>

<div class="segmented" role="radiogroup" aria-label={label}>
  {#each options as option (option.value)}
    <button
      type="button"
      role="radio"
      aria-checked={value === option.value}
      class:active={value === option.value}
      onclick={() => {
        value = option.value;
        onchange?.(option.value);
      }}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .segmented {
    display: inline-flex;
    background: var(--surface-2);
    border-radius: var(--r-m);
    padding: 3px;
    gap: 2px;
    max-width: 100%;
  }
  button {
    border: 0;
    background: transparent;
    min-height: 38px;
    padding: 0 var(--s-3);
    border-radius: calc(var(--r-m) - 3px);
    color: var(--muted);
    white-space: nowrap;
  }
  button.active {
    background: var(--surface);
    color: var(--text);
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  }
</style>
