export class NotificationCount {
  constructor(readonly value: number = 0) {}

  add(n: number) {
    return new NotificationCount(this.value + n)
  }

  reset() {
    return new NotificationCount()
  }
}
