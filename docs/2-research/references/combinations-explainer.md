# How combinations.ts Works — Backtracking Explainer

## The Analogy

Imagine you have a bag of **numbered balls** (0, 1, 2, ... n-1) and you need to pick **k** of them. Order doesn't matter — picking {0, 2} is the same as {2, 0}.

`getCombinations(n, k)` returns every possible pick. It works by:

1. **Reaching into the bag** — pick a ball (push)
2. **Checking your hand** — got enough? Save it
3. **Putting the last one back** — try the next ball instead (pop)

This "pick, go deeper, undo" loop is called **backtracking**.

---

## The function

```ts
// src/shared/utils/combinations.ts

export function getCombinations(n: number, k: number): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, current: number[]) {
    if (current.length === k) {   // got enough — save and stop
      result.push([...current]);
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(i);            // pick i
      backtrack(i + 1, current);  // go deeper, only look AFTER i
      current.pop();              // un-pick i, try next
    }
  }

  backtrack(0, []);
  return result;
}
```

Three moving parts:

| Part | Role |
|------|------|
| `result` | Collects every valid combination |
| `current` | The hand you're building right now |
| `start` | Prevents duplicates — only pick numbers **after** the last one you picked |

---

## Walkthrough: `getCombinations(4, 2)`

Pick 2 from [0, 1, 2, 3]. There are 6 possible combinations.

```
backtrack(0, [])
  push(0) → [0]
    backtrack(1, [0])
      push(1) → [0, 1]  ✅ SAVE
      pop(1)  → [0]
      push(2) → [0, 2]  ✅ SAVE
      pop(2)  → [0]
      push(3) → [0, 3]  ✅ SAVE
      pop(3)  → [0]
  pop(0) → []
  push(1) → [1]
    backtrack(2, [1])
      push(2) → [1, 2]  ✅ SAVE
      pop(2)  → [1]
      push(3) → [1, 3]  ✅ SAVE
      pop(3)  → [1]
  pop(1) → []
  push(2) → [2]
    backtrack(3, [2])
      push(3) → [2, 3]  ✅ SAVE
      pop(3)  → [2]
  pop(2) → []
  push(3) → [3]
    backtrack(4, [3])     ← nothing left to pair with, loop doesn't run
  pop(3) → []

Result: [0,1] [0,2] [0,3] [1,2] [1,3] [2,3]
```

Notice how `start = i + 1` means we never look backwards. After picking 1, we only try 2 and 3 — never 0. This is what prevents duplicates.

---

## Why `[...current]` and not just `current`

```ts
result.push([...current]);  // snapshot
```

`current` is mutated on every push/pop. If we stored a reference (`result.push(current)`), every entry in `result` would point to the same array — which ends up empty after all the pops. The spread `[...]` takes a snapshot at the moment of saving.

---

## How it's used in Motion Matrix

In `Hook.tsx`, the hexagon has 6 slices (n=6). The scene needs all ways to pick 3 slices (k=3) to highlight:

```ts
const allCombos = getCombinations(6, 3);
// → 20 combinations: [0,1,2], [0,1,3], [0,1,4], ... [3,4,5]
```

This is computed **once** outside the component, not per-frame. During the flashing section (frames 75-155), it cycles through all 20 combinations at 4 frames each.

---

## The maths

The number of combinations follows the formula:

```
C(n, k) = n! / (k! × (n - k)!)
```

Some examples:

| n | k | Combinations | Count |
|---|---|-------------|-------|
| 4 | 2 | [0,1] [0,2] [0,3] [1,2] [1,3] [2,3] | 6 |
| 6 | 3 | all ways to pick 3 slices from a hexagon | 20 |
| 6 | 1 | each slice alone | 6 |
| 6 | 6 | all slices (only one way) | 1 |

---

## Try it yourself

The playground file logs every push, pop, and save so you can follow the recursion:

```bash
npx tsx _docs/2-research/references/combinations-playground.ts
```

Change `n` and `k` at the top of that file to experiment with different inputs.
