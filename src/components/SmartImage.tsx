import { useState, type ImgHTMLAttributes } from 'react'
import { fallbackPhotoFor } from '../data/photoLibrary'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  fallbackSeed?: string
}

/**
 * SmartImage — wrap em <img> com fallback automático.
 *
 * Se a URL primária do Unsplash falhar (ID removido, rede etc),
 * troca pro fallback determinístico baseado em seed pro card não quebrar.
 */
export function SmartImage({ src, fallbackSeed = src, alt = '', ...rest }: Props) {
  const [current, setCurrent] = useState(src)
  const [errored, setErrored] = useState(false)

  return (
    <img
      {...rest}
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (errored) return
        setErrored(true)
        setCurrent(fallbackPhotoFor(fallbackSeed))
      }}
    />
  )
}
