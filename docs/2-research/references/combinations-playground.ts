/**
 * Combinations Playground
 * Run with: npx tsx _docs/references/combinations-playground.ts
 *
 * Play with n and k below to see how backtracking builds combinations.
 * The logging shows every push, pop, and save so you can follow along.
 */

// ── CHANGE THESE TO EXPERIMENT ──
const n = 4; // total items (0, 1, 2, ... n-1)
const k = 2; // how many to pick
// ─────────────────────────────────

const result: number[][] = [];
let depth = 0; // tracks indentation for logging

function backtrack(start: number, current: number[]) {
  const indent = "  ".repeat(depth);

  // THE IF: have we picked enough?
  if (current.length === k) {
    console.log(`${indent}✅ SAVE [${current}] — length is ${k}, done!`);
    result.push([...current]); // spread = snapshot, not a reference
    return; // stop going deeper, go back up
  }

  // THE FOR LOOP: try each number from start onwards
  for (let i = start; i < n; i++) {
    console.log(`${indent}push(${i}) → [${[...current, i]}]`);
    current.push(i); // pick i

    depth++;
    backtrack(i + 1, current); // go deeper, starting AFTER i
    depth--;

    current.pop(); // un-pick i
    console.log(`${indent}pop(${i})  → [${current}]  (backtrack, try next)`);
  }
}

console.log(`\nFinding all ways to pick ${k} from [${Array.from({ length: n }, (_, i) => i)}]\n`);
console.log("─".repeat(50));

backtrack(0, []);

console.log("─".repeat(50));
console.log(`\nResult: ${result.length} combinations`);
console.log(result.map((c) => `  [${c}]`).join("\n"));
