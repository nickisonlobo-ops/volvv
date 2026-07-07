// ═══════════════════════════════════════════════════════════════
// Upload RESUMÁVEL de vídeo para a Meta (/act_<id>/advideos).
// Fases: start → transfer (em chunks) → finish. Retorna o video_id.
// O processamento do vídeo é assíncrono na Meta (pode levar minutos).
// ═══════════════════════════════════════════════════════════════

import type { Credenciais } from './types'

const GRAPH = 'https://graph.facebook.com/v21.0'
function actId(id: string): string { return id.startsWith('act_') ? id : `act_${id}` }

function extrairErro(e: any): string {
  return e?.data?.error?.error_user_msg || e?.data?.error?.message || e?.message || 'Falha no upload de vídeo.'
}

export async function metaUploadVideoFile(
  creds: Credenciais,
  fileBuf: Uint8Array,
  filename = 'video.mp4',
): Promise<{ ok: boolean; id?: string; erro?: string }> {
  if (!creds.accessToken || !creds.accountId) return { ok: false, erro: 'Credenciais ausentes.' }
  const acc = actId(creds.accountId)
  const token = creds.accessToken
  const size = fileBuf.length

  try {
    // 1) start
    const start = await $fetch<{ upload_session_id: string; video_id: string; start_offset: string; end_offset: string }>(
      `${GRAPH}/${acc}/advideos`,
      { method: 'POST', body: { upload_phase: 'start', file_size: size, access_token: token } },
    )
    const sessionId = start.upload_session_id
    const videoId = start.video_id
    let startOffset = Number(start.start_offset)
    let endOffset = Number(start.end_offset)

    // 2) transfer (chunks)
    let guard = 0
    while (startOffset < endOffset && guard < 1000) {
      guard++
      const chunk = fileBuf.subarray(startOffset, endOffset)
      const fd = new FormData()
      fd.append('access_token', token)
      fd.append('upload_phase', 'transfer')
      fd.append('upload_session_id', sessionId)
      fd.append('start_offset', String(startOffset))
      fd.append('video_file_chunk', new Blob([chunk]), filename)
      const t = await $fetch<{ start_offset: string; end_offset: string }>(`${GRAPH}/${acc}/advideos`, { method: 'POST', body: fd })
      startOffset = Number(t.start_offset)
      endOffset = Number(t.end_offset)
    }

    // 3) finish
    await $fetch(`${GRAPH}/${acc}/advideos`, {
      method: 'POST',
      body: { upload_phase: 'finish', upload_session_id: sessionId, access_token: token },
    })

    return { ok: true, id: videoId }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}
