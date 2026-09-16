<script lang="ts">
  import { BANDS } from "../audio/constants";
  import { t } from "../i18n/index.svelte";
</script>

<ul class="legend small" aria-label={t().bands.legend}>
  <li><i class="swatch m"></i>{t().bands.masculine} <span class="muted">&lt; {BANDS.masculineMaxHz} Hz</span></li>
  <li><i class="swatch a"></i>{t().bands.androgynous} <span class="muted">{BANDS.masculineMaxHz}–{BANDS.androgynousMaxHz} Hz</span></li>
  <li><i class="swatch f"></i>{t().bands.feminine} <span class="muted">&gt; {BANDS.androgynousMaxHz} Hz</span></li>
</ul>

<style>
  .legend {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--s-2) var(--s-4);
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
  }
  .swatch {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
  .m {
    background: var(--band-m);
  }
  .a {
    background: var(--band-a);
  }
  .f {
    background: var(--band-f);
  }
</style>
