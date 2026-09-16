<script lang="ts">
  import { t, toggleLang } from "../i18n/index.svelte";
</script>

<button class="icon" type="button" onclick={toggleLang} aria-label={t().lang.switchTo} title={t().lang.switchTo}>
  {t().lang.flag}
</button>
