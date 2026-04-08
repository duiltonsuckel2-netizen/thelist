/**
 * Recorta as fotos extraídas de prints do Instagram, removendo a UI
 * (status bar, header, username row, dots, action buttons, caption, próximo post).
 *
 * Estratégia (após análise empírica de prints reais):
 * - Pula os 380 primeiros pixels (sempre status bar + header + username row no IG dark mode)
 * - Acha o TOPO da foto: primeira linha com variância de brilho > 8 (sai do escuro)
 * - Acha o FUNDO da foto: última linha antes de um gap escuro de 15+ linhas
 *   (std < 5 = chrome do IG resumindo: dots + action buttons + caption)
 *
 * Uso: node scripts/crop-insta.mjs <inputDir> <outputDir>
 */
import sharp from 'sharp'
import { readdirSync, mkdirSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const SKIP_TOP = 380          // chrome topo do IG (status bar + header + username)
const SKIP_BOTTOM = 50        // margem mínima do fundo
const PHOTO_THRESHOLD = 8     // std mínimo pra ser considerado conteúdo de foto
const GAP_THRESHOLD = 5       // std abaixo disso = chrome escuro do IG
const GAP_MIN_RUN = 15        // gap precisa ter pelo menos 15 linhas pra "fechar" a foto

async function rowStds(filepath) {
  const { data, info } = await sharp(filepath).raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const stds = new Float32Array(height)
  for (let y = 0; y < height; y++) {
    let sum = 0
    let sumSq = 0
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const b = (data[i] + data[i + 1] + data[i + 2]) / 3
      sum += b
      sumSq += b * b
    }
    const mean = sum / width
    stds[y] = Math.sqrt(Math.max(0, sumSq / width - mean * mean))
  }
  return { stds, width, height }
}

async function detectPhotoBounds(filepath) {
  const { stds, width, height } = await rowStds(filepath)

  // Topo: primeira linha após SKIP_TOP com std > PHOTO_THRESHOLD
  let top = SKIP_TOP
  for (let y = SKIP_TOP; y < height - SKIP_BOTTOM; y++) {
    if (stds[y] > PHOTO_THRESHOLD) {
      top = y
      break
    }
  }

  // Fundo: caminha pra baixo, fecha quando achar um gap escuro contíguo de
  // GAP_MIN_RUN linhas. Bottom = última linha de conteúdo antes do gap.
  let bottom = height - SKIP_BOTTOM
  for (let y = top; y < height - SKIP_BOTTOM - GAP_MIN_RUN; y++) {
    if (stds[y] < GAP_THRESHOLD) {
      // Verifica se é um gap longo
      let runLen = 0
      while (y + runLen < height && stds[y + runLen] < GAP_THRESHOLD) runLen++
      if (runLen >= GAP_MIN_RUN) {
        bottom = y - 1
        break
      }
      // Gap curto — pula e continua
      y += runLen
    }
  }

  return { top, bottom, width, height }
}

async function processOne(input, output) {
  const { top, bottom, width, height } = await detectPhotoBounds(input)
  const cropHeight = bottom - top + 1
  console.log(
    `  ${basename(input)} → ${basename(output)} | ${width}x${cropHeight} (y=${top}..${bottom} de ${height})`,
  )
  await sharp(input)
    .extract({ left: 0, top, width, height: cropHeight })
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(output)
}

async function main() {
  const inputDir = process.argv[2]
  const outputDir = process.argv[3]
  if (!inputDir || !outputDir) {
    console.error('uso: node scripts/crop-insta.mjs <inputDir> <outputDir>')
    process.exit(1)
  }
  mkdirSync(outputDir, { recursive: true })
  const files = readdirSync(inputDir)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()
  console.log(`Processando ${files.length} foto(s):`)
  let i = 1
  for (const file of files) {
    const input = join(inputDir, file)
    if (!statSync(input).isFile()) continue
    await processOne(input, join(outputDir, `${i}.jpg`))
    i++
  }
  console.log(`✓ ${i - 1} salvas em ${outputDir}`)
}

main().catch((err) => {
  console.error('erro:', err)
  process.exit(1)
})
