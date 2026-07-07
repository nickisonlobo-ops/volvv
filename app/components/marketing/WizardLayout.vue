<template>
  <div class="wz-shell">
    <!-- Sidebar -->
    <aside class="wz-sidebar">
      <div class="wz-brand">
        <div class="wz-brand-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
        </div>
        <div class="wz-brand-text">
          <strong>Novo anúncio</strong>
          <span>Publicação na Meta</span>
        </div>
      </div>

      <nav class="wz-steps">
        <template v-for="(s, i) in steps" :key="i">
          <button type="button" class="wz-step" :class="{ active: step === i + 1, done: step > i + 1 }" @click="$emit('go', i + 1)">
            <span class="wz-step-num">
              <svg v-if="step > i + 1" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <template v-else>{{ i + 1 }}</template>
            </span>
            <div class="wz-step-info"><strong>{{ s.title }}</strong><span>{{ s.sub }}</span></div>
          </button>
          <div v-if="i < steps.length - 1" class="wz-step-line" :class="{ done: step > i + 1 }"></div>
        </template>
      </nav>

      <div class="wz-spacer"></div>
      <div class="wz-autosave"><span class="wz-autosave-dot"></span>Rascunho salvo automaticamente</div>
    </aside>

    <!-- Main -->
    <div class="wz-main">
      <div class="wz-progress">
        <div class="wz-progress-track"><div class="wz-progress-bar" :style="{ width: (step / totalSteps * 100) + '%' }"></div></div>
        <button type="button" class="wz-close" title="Fechar" @click="$emit('close')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="wz-body"><slot></slot></div>
      <div class="wz-footer">
        <button type="button" class="wz-btn-ghost" @click="$emit('close')">Cancelar</button>
        <div class="wz-footer-spacer"></div>
        <button v-if="step > 1" type="button" class="wz-btn-outline" @click="$emit('go', step - 1)">Voltar</button>
        <slot name="footer-action">
          <button v-if="step < totalSteps" type="button" class="wz-btn-primary" @click="$emit('go', step + 1)">
            Continuar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </slot>
      </div>
    </div>

    <!-- Preview -->
    <aside class="wz-preview">
      <div class="wz-preview-header">
        <span>PRÉVIA AO VIVO</span>
        <div class="wz-preview-tabs">
          <button type="button" :class="{ active: previewTab === 'feed' }" @click="$emit('update:previewTab', 'feed')">Feed</button>
          <button type="button" :class="{ active: previewTab === 'stories' }" @click="$emit('update:previewTab', 'stories')">Stories</button>
        </div>
      </div>
      <div class="wz-preview-body">
        <slot name="preview"></slot>
      </div>
      <p class="wz-preview-note">Prévia aproximada — a renderização varia por posicionamento</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
defineProps<{ step: number; totalSteps: number; steps: { title: string; sub: string }[]; previewTab: 'feed' | 'stories' }>()
defineEmits<{ (e: 'go', step: number): void; (e: 'close'): void; (e: 'update:previewTab', tab: 'feed' | 'stories'): void }>()
</script>

<style scoped>
.wz-shell { display: flex; width: 100%; max-width: 1180px; height: min(724px, 90vh); border-radius: 20px; overflow: hidden; background: #fff; box-shadow: 0 40px 90px -24px rgba(16,24,40,0.4); }

/* Sidebar */
.wz-sidebar { width: 250px; min-width: 208px; background: #f8fafc; border-right: 1px solid #edf0f4; display: flex; flex-direction: column; padding: 22px 16px 18px; flex-shrink: 0; }
.wz-brand { display: flex; align-items: center; gap: 11px; padding: 0 8px; }
.wz-brand-icon { width: 32px; height: 32px; flex-shrink: 0; border-radius: 10px; background: linear-gradient(135deg, #2457e6, #1c46c4); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px -4px rgba(36,87,230,0.4); }
.wz-brand-text { min-width: 0; }
.wz-brand-text strong { display: block; font-size: 14.5px; font-weight: 800; letter-spacing: -0.01em; color: #101828; }
.wz-brand-text span { display: block; font-size: 11px; color: #98a2b3; margin-top: 1px; }

.wz-steps { display: flex; flex-direction: column; margin-top: 26px; }
.wz-step { display: flex; align-items: center; gap: 12px; padding: 8px; border: none; background: transparent; border-radius: 12px; cursor: pointer; text-align: left; width: 100%; transition: background 0.15s; }
.wz-step:hover { background: rgba(36,87,230,0.06); }
.wz-step-num { width: 30px; height: 30px; flex-shrink: 0; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 700; border: 1.5px solid #e1e5eb; color: #98a2b3; background: transparent; transition: all 0.2s; }
.wz-step.active .wz-step-num { background: #2457e6; color: #fff; border-color: transparent; }
.wz-step.done .wz-step-num { background: rgba(36,87,230,0.12); color: #2457e6; border-color: transparent; }
.wz-step-info { min-width: 0; }
.wz-step-info strong { display: block; font-size: 13px; font-weight: 700; color: #98a2b3; }
.wz-step.active .wz-step-info strong, .wz-step.done .wz-step-info strong { color: #101828; }
.wz-step-info span { font-size: 11px; color: #98a2b3; }
.wz-step-line { width: 2px; height: 14px; margin-left: 22px; border-radius: 2px; background: #e7eaf0; }
.wz-step-line.done { background: #2457e6; }

.wz-spacer { flex: 1; }
.wz-autosave { display: flex; align-items: center; gap: 8px; padding: 0 8px; font-size: 11.5px; color: #98a2b3; }
.wz-autosave-dot { width: 7px; height: 7px; flex-shrink: 0; border-radius: 999px; background: #12b76a; animation: wzPulse 2.4s ease infinite; }
@keyframes wzPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Main */
.wz-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.wz-progress { display: flex; align-items: center; gap: 14px; padding: 18px 26px 0; }
.wz-progress-track { flex: 1; height: 4px; border-radius: 999px; background: #eff2f5; overflow: hidden; }
.wz-progress-bar { height: 100%; border-radius: 999px; background: #2457e6; transition: width 0.35s cubic-bezier(0.4,0,0.2,1); }
.wz-close { width: 30px; height: 30px; flex-shrink: 0; border: none; border-radius: 9px; background: transparent; color: #98a2b3; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.wz-close:hover { background: #eff2f5; }

.wz-body { flex: 1; overflow-y: auto; padding: 16px 26px 24px; min-height: 0; }

.wz-footer { display: flex; align-items: center; gap: 10px; padding: 14px 26px; border-top: 1px solid #edf0f4; flex-shrink: 0; }
.wz-footer-spacer { flex: 1; }
.wz-btn-ghost { height: 38px; padding: 0 14px; border: none; border-radius: 10px; background: transparent; color: #475467; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.wz-btn-ghost:hover { background: #eff2f5; }
.wz-btn-outline { height: 38px; padding: 0 16px; border: 1px solid #e4e7ec; border-radius: 10px; background: transparent; color: #101828; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.wz-btn-outline:hover { background: #eff2f5; }
.wz-btn-primary { display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 18px; border: none; border-radius: 10px; background: #2457e6; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 1px 2px rgba(16,24,40,0.15), inset 0 1px 0 rgba(255,255,255,0.14); transition: background 0.15s, transform 0.06s; }
.wz-btn-primary:hover { background: #1c46c4; }
.wz-btn-primary:active { transform: translateY(1px); }
.wz-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

/* Preview */
.wz-preview { width: 320px; min-width: 280px; flex-shrink: 0; background: #f3f5f8; border-left: 1px solid #edf0f4; display: flex; flex-direction: column; background-image: radial-gradient(rgba(16,24,40,0.05) 1px, transparent 1px); background-size: 18px 18px; }
.wz-preview-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 8px; }
.wz-preview-header > span { font-family: ui-monospace, Menlo, monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.14em; color: #98a2b3; }
.wz-preview-tabs { display: flex; padding: 2px; border-radius: 8px; background: #e9edf2; }
.wz-preview-tabs button { padding: 5px 11px; border: none; border-radius: 6px; cursor: pointer; font-size: 11.5px; font-weight: 600; background: transparent; color: #475467; transition: all 0.15s; }
.wz-preview-tabs button.active { background: #fff; color: #101828; box-shadow: 0 1px 2px rgba(16,24,40,0.12); }
.wz-preview-body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 8px 18px; min-height: 0; overflow-y: auto; }
.wz-preview-empty { font-size: 12px; color: #98a2b3; text-align: center; padding: 24px; }
.wz-preview-note { padding: 8px 18px 14px; font-size: 10.5px; color: #98a2b3; text-align: center; }

@media (max-width: 900px) { .wz-sidebar, .wz-preview { display: none; } .wz-shell { height: 95vh; border-radius: 12px; } }
</style>
