<template>
  <div class="wz-shell">
    <!-- Sidebar -->
    <aside class="wz-sidebar">
      <div class="wz-brand">
        <div class="wz-brand-icon">+</div>
        <div class="wz-brand-text">
          <strong>Novo anúncio</strong>
          <span>Publicação na Meta</span>
        </div>
      </div>
      <nav class="wz-steps">
        <div v-for="(s, i) in steps" :key="i" class="wz-step" :class="{ active: step === i + 1, done: step > i + 1 }" @click="$emit('go', i + 1)">
          <span class="wz-step-num">{{ step > i + 1 ? '✓' : i + 1 }}</span>
          <div class="wz-step-info"><strong>{{ s.title }}</strong><span>{{ s.sub }}</span></div>
        </div>
      </nav>
    </aside>

    <!-- Main -->
    <div class="wz-main">
      <div class="wz-progress"><div class="wz-progress-bar" :style="{ width: (step / totalSteps * 100) + '%' }"></div><button class="wz-close" @click="$emit('close')">×</button></div>
      <div class="wz-body"><slot></slot></div>
      <div class="wz-footer">
        <span class="wz-autosave">● Rascunho salvo automaticamente</span>
        <div class="wz-footer-btns">
          <button class="wz-btn-ghost" @click="$emit('close')">Cancelar</button>
          <button v-if="step > 1" class="wz-btn-ghost" @click="$emit('go', step - 1)">Voltar</button>
          <slot name="footer-action">
            <button v-if="step < totalSteps" class="wz-btn-primary" @click="$emit('go', step + 1)">Continuar →</button>
          </slot>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <aside class="wz-preview">
      <div class="wz-preview-header"><span>PRÉVIA AO VIVO</span><div class="wz-preview-tabs"><button class="active">Feed</button><button>Stories</button></div></div>
      <slot name="preview"></slot>
      <p class="wz-preview-note">Prévia aproximada — a renderização varia por posicionamento</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
defineProps<{ step: number; totalSteps: number; steps: { title: string; sub: string }[] }>()
defineEmits<{ (e: 'go', step: number): void; (e: 'close'): void }>()
</script>

<style scoped>
.wz-shell { display: flex; width: 100%; max-width: 1200px; height: 90vh; max-height: 800px; border-radius: 16px; overflow: hidden; background: #fff; box-shadow: 0 25px 80px rgba(0,0,0,0.25); }
.wz-sidebar { width: 220px; background: #f8fafc; border-right: 1px solid #eef1f5; padding: 24px 16px; display: flex; flex-direction: column; gap: 24px; flex-shrink: 0; }
.wz-brand { display: flex; align-items: center; gap: 10px; }
.wz-brand-icon { width: 36px; height: 36px; border-radius: 50%; background: #2457e6; color: #fff; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.wz-brand-text { display: flex; flex-direction: column; }
.wz-brand-text strong { font-size: 13px; color: #0f1720; }
.wz-brand-text span { font-size: 11px; color: #8a97a6; }
.wz-steps { display: flex; flex-direction: column; gap: 4px; }
.wz-step { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
.wz-step:hover { background: #eef1f5; }
.wz-step.active { background: #eef3fd; }
.wz-step.active .wz-step-num { background: #2457e6; color: #fff; }
.wz-step.done .wz-step-num { background: #22c55e; color: #fff; font-size: 11px; }
.wz-step-num { width: 28px; height: 28px; border-radius: 50%; background: #e6eaf0; color: #6b7a8a; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.wz-step-info { display: flex; flex-direction: column; }
.wz-step-info strong { font-size: 12px; color: #22303d; }
.wz-step-info span { font-size: 10px; color: #8a97a6; }
.wz-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.wz-progress { position: relative; height: 4px; background: #eef1f5; flex-shrink: 0; }
.wz-progress-bar { height: 100%; background: #2457e6; border-radius: 0 4px 4px 0; transition: width 0.3s ease; }
.wz-close { position: absolute; right: 16px; top: 8px; width: 28px; height: 28px; border-radius: 50%; border: none; background: #f0f2f5; color: #6b7a8a; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.wz-close:hover { background: #e6eaf0; }
.wz-body { flex: 1; overflow-y: auto; padding: 32px 36px; }
.wz-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 36px; border-top: 1px solid #eef1f5; flex-shrink: 0; }
.wz-autosave { font-size: 11px; color: #22c55e; font-weight: 500; }
.wz-footer-btns { display: flex; gap: 10px; }
.wz-btn-ghost { padding: 9px 18px; border-radius: 8px; border: none; background: none; color: #33404e; font-size: 13px; font-weight: 500; cursor: pointer; }
.wz-btn-ghost:hover { background: #f0f2f5; }
.wz-btn-primary { padding: 9px 20px; border-radius: 8px; border: none; background: #2457e6; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(36,87,230,0.25); }
.wz-btn-primary:hover { background: #1c46c4; }
.wz-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.wz-preview { width: 300px; background: #f8fafc; border-left: 1px solid #eef1f5; padding: 16px; display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; overflow-y: auto; }
.wz-preview-header { display: flex; align-items: center; justify-content: space-between; }
.wz-preview-header > span { font-size: 10px; font-weight: 700; color: #8a97a6; letter-spacing: 0.5px; }
.wz-preview-tabs { display: flex; gap: 2px; }
.wz-preview-tabs button { padding: 4px 12px; border-radius: 6px; border: 1px solid #e6eaf0; background: #fff; font-size: 11px; font-weight: 500; color: #33404e; cursor: pointer; }
.wz-preview-tabs button.active { background: #22303d; color: #fff; border-color: #22303d; }
.wz-preview-note { font-size: 10px; color: #98a4b3; text-align: center; margin-top: auto; }
@media (max-width: 900px) { .wz-sidebar, .wz-preview { display: none; } .wz-shell { height: 95vh; border-radius: 12px; } }
</style>
