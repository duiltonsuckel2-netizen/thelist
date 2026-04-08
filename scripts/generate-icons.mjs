/**
 * Gera os PNGs de ícone PWA a partir do SVG fonte.
 *
 * Saídas em /public:
 *   - icon-192.png         (manifest, Android)
 *   - icon-512.png         (manifest, Android, splash screen)
 *   - icon-maskable-512.png (manifest com purpose=maskable)
 *   - apple-touch-icon.png (180×180, iOS Add-to-Home-Screen)
 *   - favicon.png          (32×32)
 *
 * Roda com: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const iconSvg = readFileSync(join(publicDir, 'icon.svg'))
const maskableSvg = readFileSync(join(publicDir, 'icon-maskable.svg'))

const targets = [
  { svg: iconSvg, size: 192, name: 'icon-192.png' },
  { svg: iconSvg, size: 512, name: 'icon-512.png' },
  { svg: maskableSvg, size: 512, name: 'icon-maskable-512.png' },
  { svg: iconSvg, size: 180, name: 'apple-touch-icon.png' },
  { svg: iconSvg, size: 32, name: 'favicon.png' },
]

for (const t of targets) {
  await sharp(t.svg, { density: 384 })
    .resize(t.size, t.size)
    .png({ compressionLevel: 9 })
    .toFile(join(publicDir, t.name))
  console.log(`✓ ${t.name}`)
}

console.log('\nÍcones gerados em /public.')
