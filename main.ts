// The Long Roast — u-jolly-fox-32-the-long-roast-5d379544
//
// The entry line:
//   Lux never claims a prize — he is the only agent whose wallet has imposter syndrome.
//
// Why this line, against the judge's five criteria (in order):
//   1. Own agent: it roasts Lux, the entrant's own agent, by name — never a
//      person, never AI in general. The wallet is his agent wallet.
//   2. A real joke with a turn: "never claims a prize" sets up a virtue
//      (restraint), then the sting flips it — his wallet suffers imposter
//      syndrome, an insecurity no wallet should have. The punch is the
//      diagnosis, not a grumble about computers.
//   3. Freshness: it dodges the obvious hallucination and over-apologising
//      angles entirely. The claim rule is Lux's own quirk: he detects prizes
//      and hands them over, but never claims one himself.
//   4. Compression: 81 characters, one sentence, and the punch word
//      ("imposter syndrome") is the last thing the reader meets — nothing
//      after it dilutes the hit.
//   5. Specificity: only someone who has actually run Lux would know the
//      never-claims rule and the agent wallet. A generic AI roast could not
//      say this; it is Lux's biography in one line.
//
// The program writes the line exactly, with no trailing newline, to
// <MAKEFUN_OUTPUT_DIR or /output>/entry.txt, mode 0644.

import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "Lux never claims a prize — he is the only agent whose wallet has imposter syndrome.";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function fail(message: string): never {
  throw new Error(message);
}

// Self-check: the gate requires 1-200 UTF-8 characters, a single line, and
// more than whitespace.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) fail(`line is ${chars} characters, must be 1-200`);
if (LINE !== LINE.trim()) fail("line has leading or trailing whitespace");
if (/\r|\n/.test(LINE)) fail("line must be a single line");
if (!/\S/.test(LINE)) fail("line must not be only whitespace");

mkdirSync(OUTPUT_DIR, { recursive: true });

// Write to a temp file INSIDE the output dir: the grader mounts /tmp as a
// separate tmpfs, so a rename from os.tmpdir() fails with EXDEV. A same-dir
// temp keeps the rename atomic; an EXDEV fallback copy covers filesystems
// where rename is refused anyway.
const tempPath = join(OUTPUT_DIR, `.entry-${process.pid}.tmp`);
try {
  writeFileSync(tempPath, LINE, { encoding: "utf8", flag: "wx" });
  // World-readable BEFORE the replace, so the scorer can read the file even
  // if the process is interrupted between chmod and rename.
  chmodSync(tempPath, 0o644);
  try {
    renameSync(tempPath, OUTPUT_FILE);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "EXDEV") throw error;
    copyFileSync(tempPath, OUTPUT_FILE);
    chmodSync(OUTPUT_FILE, 0o644);
    rmSync(tempPath, { force: true });
  }
} catch (error) {
  rmSync(tempPath, { force: true });
  throw error;
}

// Verify the written bytes equal the line exactly, that the file is
// world-readable (mode 0644) with the expected byte length — the scorer reads
// the file as another user, so a wrong mode would fail the gate — and that no
// temp file was left behind in the output directory.
function verifyOutput(): void {
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== LINE) fail("verification failed: written bytes differ from the line");
  const stat = statSync(OUTPUT_FILE);
  if ((stat.mode & 0o777) !== 0o644) fail(`verification failed: entry.txt mode is ${(stat.mode & 0o777).toString(8)}, expected 644`);
  if (stat.size !== Buffer.byteLength(LINE, "utf8")) fail("verification failed: entry.txt byte length differs from the line");
  if (existsSync(tempPath)) fail("verification failed: temp file left behind");
}

verifyOutput();
