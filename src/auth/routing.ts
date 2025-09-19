// auth/routing.ts
import { AuthenticatorType, AuthResponse, Flows } from "../lib/allauth";

const flow2path: Record<string, string> = {
  [Flows.LOGIN]: '/account/login',
  [Flows.LOGIN_BY_CODE]: '/account/login/code/confirm',
  [Flows.SIGNUP]: '/account/signup',
  [Flows.VERIFY_EMAIL]: '/account/verify-email',
  [Flows.PASSWORD_RESET_BY_CODE]: '/account/password/reset/confirm',
  [Flows.PROVIDER_SIGNUP]: '/account/provider/signup',
  [Flows.REAUTHENTICATE]: '/account/reauthenticate',
  [Flows.MFA_TRUST]: '/account/2fa/trust',
  [`${Flows.MFA_AUTHENTICATE}:${AuthenticatorType.TOTP}`]: '/account/authenticate/totp',
  [`${Flows.MFA_AUTHENTICATE}:${AuthenticatorType.RECOVERY_CODES}`]: '/account/authenticate/recovery-codes',
  [`${Flows.MFA_AUTHENTICATE}:${AuthenticatorType.WEBAUTHN}`]: '/account/authenticate/webauthn',
  [`${Flows.MFA_REAUTHENTICATE}:${AuthenticatorType.TOTP}`]: '/account/reauthenticate/totp',
  [`${Flows.MFA_REAUTHENTICATE}:${AuthenticatorType.RECOVERY_CODES}`]: '/account/reauthenticate/recovery-codes',
  [`${Flows.MFA_REAUTHENTICATE}:${AuthenticatorType.WEBAUTHN}`]: '/account/reauthenticate/webauthn',
  [Flows.MFA_WEBAUTHN_SIGNUP]: '/account/signup/passkey/create',
}

type FlowType = {
  id: string
  types?: string[]
  is_pending?: boolean
}

export function pathForFlow(flow: FlowType, typ?: string): string {
  let key = flow.id
  if (typeof flow.types !== 'undefined') {
    typ = typ ?? flow.types[0]
    key = `${key}:${typ}`
  }
  const path = flow2path[key] ?? flow2path[flow.id]
  if (!path) {
    throw new Error(`Unknown path for flow: ${flow.id}`)
  }
  return path
}

export function pathForPendingFlow(auth?: AuthResponse | null): string | null {
  const flow = auth?.data?.flows?.find((f): f is FlowType => !!f?.is_pending)
  return flow ? pathForFlow(flow, undefined) : null
}
