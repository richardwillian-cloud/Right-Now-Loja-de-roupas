/** Resolve imagens da pasta /public/products (ou data URLs enviadas pelo admin). */
export const productImage = (file: string) =>
  file.startsWith('data:') || file.startsWith('http')
    ? file
    : `${import.meta.env.BASE_URL}products/${file}`
