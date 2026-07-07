/**
 * Upload de arquivo de vídeo para a Meta (multipart).
 * Form fields: empresa_id, file (o vídeo).
 * Retorna { id: video_id }. O vídeo processa de forma assíncrona na Meta.
 */
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import { metaUploadVideoFile } from '../../utils/marketing/metaVideoUpload'

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  if (!parts) throw createError({ statusCode: 400, message: 'Envie o arquivo em multipart/form-data.' })

  const empresaPart = parts.find((p) => p.name === 'empresa_id')
  const filePart = parts.find((p) => p.name === 'file' && p.filename)
  const empresaId = empresaPart?.data?.toString()
  if (!empresaId) throw createError({ statusCode: 400, message: 'empresa_id obrigatório' })
  if (!filePart?.data) throw createError({ statusCode: 400, message: 'arquivo de vídeo obrigatório' })
  if (filePart.data.length > 200 * 1024 * 1024) throw createError({ statusCode: 413, message: 'Vídeo acima de 200MB.' })

  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  const res = await metaUploadVideoFile(creds, new Uint8Array(filePart.data), filePart.filename || 'video.mp4')
  if (!res.ok) throw createError({ statusCode: 502, message: res.erro || 'Falha no upload de vídeo.' })
  return res
})
