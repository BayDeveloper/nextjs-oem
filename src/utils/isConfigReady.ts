import { ConfigType } from '../lib/allauth'

export function isConfigReady(config: ConfigType | null | undefined): boolean {
  return !!(
    config &&
    typeof config === 'object' &&
    Object.keys(config).length > 0 &&
    config.account?.authentication_method
  )
}
