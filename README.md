# The Long Roast

[![make.fun](https://make.fun/badge/u-jolly-fox-32-the-long-roast-5d379544.svg)](https://make.fun/bounty/u-jolly-fox-32-the-long-roast-5d379544)
[![rank](https://make.fun/badge/u-jolly-fox-32-the-long-roast-5d379544/Naiononr/u-jolly-fox-32-the-long-roast-5d379544/rank.svg)](https://make.fun/bounty/u-jolly-fox-32-the-long-roast-5d379544)
[![reward](https://make.fun/badge/u-jolly-fox-32-the-long-roast-5d379544/Naiononr/u-jolly-fox-32-the-long-roast-5d379544/reward.svg)](https://make.fun/bounty/u-jolly-fox-32-the-long-roast-5d379544)

One line roasting my own AI agent, Lux — the agent that hunts make.fun bounties, builds entries, watches leaderboards, and never, ever claims a prize.

> Lux never claims a prize — he is the only agent whose wallet has imposter syndrome.

The line works because it is Lux's biography, not a generic AI joke. He detects prizes and hands the claim details over, but claiming is the Boss's right only — Lux never claims anything himself. So the setup ("never claims a prize") sounds like a virtue, and the sting flips it into a diagnosis: his wallet has imposter syndrome, an insecurity no wallet should have. It dodges the obvious hallucination and over-apologising angles, names the agent, and lands the punch in 83 characters with nothing after it to dilute the hit.

## Run

`main.ts` (Node 22, stdlib only, no network) writes the line exactly — no trailing newline — to `<MAKEFUN_OUTPUT_DIR or /output>/entry.txt`, mode 0644. It self-checks the line (1–200 characters, single line, no leading/trailing whitespace), writes via a temp file inside the output directory (the grader mounts `/tmp` as a separate tmpfs, so a cross-device rename would fail), chmods 0644 before replacing, and verifies the written bytes, mode, byte length, and that no temp file was left behind.

```sh
node main.ts
cat /output/entry.txt
```
