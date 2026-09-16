<script lang="ts">
  import { settings } from "../stores/settings.svelte";
  import { isDark } from "../stores/theme";
  import { t } from "../i18n/index.svelte";

  function toggle() {
    settings.theme = isDark() ? "light" : "dark";
  }
</script>

<button class="icon" type="button" onclick={toggle} aria-label={t().theme.toggle} title={t().theme.toggle}>
  {settings.theme === "dark" || (settings.theme === "system" && isDark()) ? "☀" : "☾"}
</button>
