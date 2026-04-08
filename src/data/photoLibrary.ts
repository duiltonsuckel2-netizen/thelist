// Curadoria de fotos placeholder do Unsplash organizadas por "mood".
// Cada lugar dos dados iniciais aponta pra um mood — o helper monta a galeria.
// O componente <SmartImage> tem fallback automático em caso de quebra.

const u = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`

export type PhotoMood =
  | 'rooftopBar'
  | 'speakeasy'
  | 'industrialBar'
  | 'bohemianBar'
  | 'trendyLounge'
  | 'frenchFineDining'
  | 'intimateDinner'
  | 'modernAsian'
  | 'sushiNight'
  | 'pizzaWoodFire'
  | 'panoramicView'
  | 'oysterTradition'
  | 'izakaya'
  | 'sensorialNight'
  | 'healthyBowl'
  | 'specialtyCafe'
  | 'literaryCafe'
  | 'beachCafe'
  | 'cozyCafe'
  | 'botanicalBrunch'
  | 'iconicBrunch'
  | 'artGallery'
  | 'vintageBooks'
  | 'outdoorCinema'

export const PHOTO_MOODS: Record<PhotoMood, string[]> = {
  rooftopBar: [
    u('1514933651103-005eec06c04b'),
    u('1551024709-8f23befc6f87'),
    u('1525268771113-32d9e9021a97'),
    u('1470337458703-46ad1756a187'),
    u('1572116469696-31de0f17cc34'),
    u('1536935338788-846bb9981813'),
  ],
  speakeasy: [
    u('1536935338788-846bb9981813'),
    u('1572116469696-31de0f17cc34'),
    u('1470337458703-46ad1756a187'),
    u('1551024709-8f23befc6f87'),
    u('1514933651103-005eec06c04b'),
    u('1525268771113-32d9e9021a97'),
  ],
  industrialBar: [
    u('1525268771113-32d9e9021a97'),
    u('1514933651103-005eec06c04b'),
    u('1470337458703-46ad1756a187'),
    u('1551024709-8f23befc6f87'),
    u('1572116469696-31de0f17cc34'),
    u('1536935338788-846bb9981813'),
  ],
  bohemianBar: [
    u('1470337458703-46ad1756a187'),
    u('1572116469696-31de0f17cc34'),
    u('1551024709-8f23befc6f87'),
    u('1514933651103-005eec06c04b'),
    u('1536935338788-846bb9981813'),
    u('1525268771113-32d9e9021a97'),
  ],
  trendyLounge: [
    u('1551024709-8f23befc6f87'),
    u('1514933651103-005eec06c04b'),
    u('1470337458703-46ad1756a187'),
    u('1525268771113-32d9e9021a97'),
    u('1572116469696-31de0f17cc34'),
    u('1536935338788-846bb9981813'),
  ],
  frenchFineDining: [
    u('1517248135467-4c7edcad34c4'),
    u('1414235077428-338989a2e8c0'),
    u('1466978913421-dad2ebd01d17'),
    u('1424847651672-bf20a4b0982b'),
    u('1538688525198-9b88f6f53126'),
    u('1551632436-cbf8dd35adfa'),
  ],
  intimateDinner: [
    u('1414235077428-338989a2e8c0'),
    u('1517248135467-4c7edcad34c4'),
    u('1538688525198-9b88f6f53126'),
    u('1424847651672-bf20a4b0982b'),
    u('1466978913421-dad2ebd01d17'),
    u('1551632436-cbf8dd35adfa'),
  ],
  modernAsian: [
    u('1579871494447-9811cf80d66c'),
    u('1611143669185-af224c5e3252'),
    u('1553621042-f6e147245754'),
    u('1562158074-4cad7f7d0f95'),
    u('1564489563601-c53cfc451e93'),
    u('1551632436-cbf8dd35adfa'),
  ],
  sushiNight: [
    u('1579871494447-9811cf80d66c'),
    u('1553621042-f6e147245754'),
    u('1611143669185-af224c5e3252'),
    u('1564489563601-c53cfc451e93'),
    u('1562158074-4cad7f7d0f95'),
    u('1551632436-cbf8dd35adfa'),
  ],
  pizzaWoodFire: [
    u('1513104890138-7c749659a591'),
    u('1571407970349-bc81e7e96d47'),
    u('1574071318508-1cdbab80d002'),
    u('1604382354936-07c5d9983bd3'),
    u('1593560708920-61dd98c46a4e'),
    u('1466978913421-dad2ebd01d17'),
  ],
  panoramicView: [
    u('1538688525198-9b88f6f53126'),
    u('1414235077428-338989a2e8c0'),
    u('1564489563601-c53cfc451e93'),
    u('1517248135467-4c7edcad34c4'),
    u('1579871494447-9811cf80d66c'),
    u('1525268771113-32d9e9021a97'),
  ],
  oysterTradition: [
    u('1559339352-11d035aa65de'),
    u('1565299543923-37dd37887442'),
    u('1611141647949-5fde87d2d0de'),
    u('1425252662672-bbf924558ee5'),
    u('1538688525198-9b88f6f53126'),
    u('1424847651672-bf20a4b0982b'),
  ],
  izakaya: [
    u('1564489563601-c53cfc451e93'),
    u('1611143669185-af224c5e3252'),
    u('1579871494447-9811cf80d66c'),
    u('1553621042-f6e147245754'),
    u('1562158074-4cad7f7d0f95'),
    u('1414235077428-338989a2e8c0'),
  ],
  sensorialNight: [
    u('1517248135467-4c7edcad34c4'),
    u('1538688525198-9b88f6f53126'),
    u('1414235077428-338989a2e8c0'),
    u('1551632436-cbf8dd35adfa'),
    u('1525268771113-32d9e9021a97'),
    u('1424847651672-bf20a4b0982b'),
  ],
  healthyBowl: [
    u('1490645935967-10de6ba17061'),
    u('1546069901-ba9599a7e63c'),
    u('1512621776951-a57141f2eefd'),
    u('1540420773420-3366772f4999'),
    u('1505253716362-afaea1d3d1af'),
    u('1551218808-94e220e084d2'),
  ],
  specialtyCafe: [
    u('1501339847302-ac426a4a7cbb'),
    u('1554118811-1e0d58224f24'),
    u('1442512595331-e89e73853f31'),
    u('1495474472287-4d71bcdd2085'),
    u('1521017432531-fbd92d768814'),
    u('1559925393-8be0ec4767c8'),
  ],
  literaryCafe: [
    u('1481627834876-b7833e8f5570'),
    u('1524995997946-a1c2e315a42f'),
    u('1495474472287-4d71bcdd2085'),
    u('1442512595331-e89e73853f31'),
    u('1501339847302-ac426a4a7cbb'),
    u('1521017432531-fbd92d768814'),
  ],
  beachCafe: [
    u('1559925393-8be0ec4767c8'),
    u('1501339847302-ac426a4a7cbb'),
    u('1495474472287-4d71bcdd2085'),
    u('1554118811-1e0d58224f24'),
    u('1442512595331-e89e73853f31'),
    u('1521017432531-fbd92d768814'),
  ],
  cozyCafe: [
    u('1554118811-1e0d58224f24'),
    u('1442512595331-e89e73853f31'),
    u('1495474472287-4d71bcdd2085'),
    u('1521017432531-fbd92d768814'),
    u('1501339847302-ac426a4a7cbb'),
    u('1559925393-8be0ec4767c8'),
  ],
  botanicalBrunch: [
    u('1525351484163-7529414344d8'),
    u('1533089860892-a7c6f0a88666'),
    u('1551218808-94e220e084d2'),
    u('1511795409834-ef04bbd61622'),
    u('1495474472287-4d71bcdd2085'),
    u('1554118811-1e0d58224f24'),
  ],
  iconicBrunch: [
    u('1533089860892-a7c6f0a88666'),
    u('1525351484163-7529414344d8'),
    u('1511795409834-ef04bbd61622'),
    u('1551218808-94e220e084d2'),
    u('1495474472287-4d71bcdd2085'),
    u('1442512595331-e89e73853f31'),
  ],
  artGallery: [
    u('1531058020387-3be344556be6'),
    u('1582555172866-f73bb12a2ab3'),
    u('1554907984-15263bfd63bd'),
    u('1499856871958-5b9627545d1a'),
    u('1536924940846-227afb31e2a5'),
    u('1545987796-200677ee1011'),
  ],
  vintageBooks: [
    u('1481627834876-b7833e8f5570'),
    u('1524995997946-a1c2e315a42f'),
    u('1532012197267-da84d127e765'),
    u('1495640388908-05fa85288e61'),
    u('1495446815901-a7297e633e8d'),
    u('1519682337058-a94d519337bc'),
  ],
  outdoorCinema: [
    u('1505740420928-5e560c06d30e'),
    u('1485846234645-a62644f84728'),
    u('1536440136628-849c177e76a1'),
    u('1542204165-65bf26472b9b'),
    u('1517604931442-7e0c8ed2963c'),
    u('1489599735734-79b4af4e3da5'),
  ],
}

export function photosFor(mood: PhotoMood): string[] {
  return PHOTO_MOODS[mood]
}

// Fallback final caso uma URL específica falhe — escolhe uma alternativa por seed.
export function fallbackPhotoFor(seed: string): string {
  const all = Object.values(PHOTO_MOODS).flat()
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return all[Math.abs(hash) % all.length]!
}
