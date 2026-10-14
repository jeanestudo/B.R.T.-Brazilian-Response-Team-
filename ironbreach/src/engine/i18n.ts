import en from '../i18n/en.json'

export type Dictionary = Record<string, string>
const DICT: Dictionary = en

/** Text lookup for the pt-BR game UI; keeps copy in one dictionary with `{name}` placeholders. */
export class I18n {
  readonly locale = 'pt-BR'
  constructor() {
    document.documentElement.lang = 'pt-BR'
  }
  t(key: string, vars: Record<string, string | number> = {}): string {
    const text = DICT[key] ?? key
    return text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
  }
}

export function translate(key: string, vars: Record<string, string | number> = {}): string {
  const text = DICT[key] ?? key
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
}

export const DICTIONARY_KEYS = Object.keys(en)
