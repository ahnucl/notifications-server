export type UseCaseResponse<T = undefined, E = undefined> =
  | [t: T, null]
  | [null, e: E]
