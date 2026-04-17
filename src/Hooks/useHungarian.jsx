import { useCallback } from 'react';

export const useHungarian = () => {
  const solve = useCallback((costMatrix) => {
    const n = costMatrix.length;
    if (n === 0) return [];

    // 1. Initialisation des potentiels (Dual variables)
    let u = new Array(n).fill(0);
    let v = new Array(n).fill(0);
    let p = new Array(n + 1).fill(0);
    let way = new Array(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
      p[0] = i;
      let j0 = 0;
      let minv = new Array(n + 1).fill(Infinity);
      let used = new Array(n + 1).fill(false);
      
      do {
        used[j0] = true;
        let i0 = p[j0], delta = Infinity, j1 = 0;
        for (let j = 1; j <= n; j++) {
          if (!used[j]) {
            // Calcul du coût réduit : cost - u - v
            let cur = costMatrix[i0 - 1][j - 1] - u[i0 - 1] - v[j - 1];
            if (cur < minv[j]) {
              minv[j] = cur;
              way[j] = j0;
            }
            if (minv[j] < delta) {
              delta = minv[j];
              j1 = j;
            }
          }
        }
        for (let j = 0; j <= n; j++) {
          if (used[j]) {
            u[p[j] - 1] += delta;
            v[j - 1] -= delta;
          } else {
            minv[j] -= delta;
          }
        }
        j0 = j1;
      } while (p[j0] !== 0);

      do {
        let j1 = way[j0];
        p[j0] = p[j1];
        j0 = j1;
      } while (j0 !== 0);
    }

    // Reconstruction du résultat : quel index de colonne pour chaque ligne
    const result = new Array(n);
    for (let j = 1; j <= n; j++) {
      result[p[j] - 1] = j - 1;
    }
    return result;
  }, []);

  return { solve };
};