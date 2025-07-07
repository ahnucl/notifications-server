export interface SocketEmitter<T = unknown> {
  toUser(userId: string, event: AppEvent<T>): void
}

export interface AppEvent<T = unknown> {
  name: DispatchEvent
  payload: T
}

export type DispatchEvent =
  | 'global:amount'
  | 'monitoringItemComment:notifications'
