function* generateId(): Generator<number> {
  let id: number = 1;
  while (true) {
    yield id;
    id++;
  }
}

export const generator: Generator<number> = generateId();
