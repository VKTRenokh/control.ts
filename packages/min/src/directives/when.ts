export const when = <T, F>(condition: boolean, trueCase: () => T, falseCase?: () => F) =>
  condition ? trueCase() : falseCase?.();
