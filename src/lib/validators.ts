import { onlyDigits } from './format'

/** Valida CPF pelos dígitos verificadores. */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const calc = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10])
}

/** Algoritmo de Luhn para número de cartão (apenas validação de formato). */
export function isValidCardNumber(value: string): boolean {
  const digits = onlyDigits(value)
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i])
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

/** MM/AA no futuro. */
export function isValidExpiry(value: string, now = new Date()): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  const lastDay = new Date(year, month, 0, 23, 59, 59)
  return lastDay >= now
}
