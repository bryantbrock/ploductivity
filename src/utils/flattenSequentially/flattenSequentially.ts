export function flattenSequentially<
  T extends object & { position: number | null }
>(arrays: T[][]): T[] {
  if (arrays.length === 0) {
    return [];
  }

  arrays.sort((a, b) => {
    const aNextStep = a[0];
    const bNextStep = b[0];

    if (!aNextStep) {
      return 1;
    }

    if (!bNextStep) {
      return -1;
    }

    return (aNextStep.position ?? 0) - (bNextStep.position ?? 0);
  });

  const result = [];
  const n = arrays.length;
  const m = arrays[0].length;

  let tmp;

  for (let j = 0; j < m; j++) {
    for (let i = 0; i < n; i++) {
      tmp = arrays[i][j];

      if (tmp) {
        result.push(arrays[i][j]);
      }
    }
  }

  return result;
}
