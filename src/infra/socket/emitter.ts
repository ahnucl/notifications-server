export interface SocketEmitter<T = unknown> {
  toUser(userId: string, event: AppEvent<T>): void
}

export interface AppEvent<T = unknown> {
  name: string
  payload: T
}

// Remove this?
export type DispatchEvent =
  | 'global:amount'
  | 'monitoringItemComment:notifications'
