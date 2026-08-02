---
title: Building ChokerJoker, the award winning quarto solver
date: 2026-01-27
description: We built a Quarto bot for a university competition and got a little carried away. It chokes out safe moves, then switches over to a perfect endgame solver.
keywords: ChokerJoker, Quarto solver, alpha-beta pruning, game AI, Java, competitive programming, Ilia Mirzaali, rmxzy
author: Ilia Mirzaali
tags:
    - "Java"
    - "Game AI"
    - "Alpha-Beta Pruning"
    - "Optimization"
    - "Competitive Programming"
thumbnail: /images/chokerjoker-cover-v3.png
accent: "#c74b32"
categories:
  - Engineering
---

So I had to build a Quarto AI for a university competition, and I quickly ran into the classic dilemma: you can either search the entire game tree perfectly (but run out of time), or you can use some heuristic evaluation and just _hope_ it doesn't blunder. Neither option felt great.

Naturally, I decided to do both. The result is **ChokerJoker**: an AI with a split personality. In the midgame, it plays like a strangler, slowly suffocating the opponent by minimizing their safe moves. Then, once the board gets sparse enough, it flips a switch and becomes a perfect endgame solver that calculates every possible outcome.

In this post I'll walk through the whole thing: bitboards, Zobrist hashing, 32-way symmetry reduction, and why I spent way too long tweaking move ordering. If you want to skip ahead and just look at the code, the full project is on GitHub:

👉 **[https://github.com/ramzxy/quarto](https://github.com/ramzxy/quarto)**


# Phase 1: The Strangler (Heuristic Midgame)

The first phase of ChokerJoker is all about **panic maximization**. The goal is to slowly choke the opponent by reducing their options until they're basically stuck.

## The Core Heuristic

After a lot of testing (and I mean _a lot_), I settled on this evaluation formula:

```
Score = -(2.21 × Safety) - (0.37 × Traps)
```

Where:
- **Safety**: The number of "safe" (square, piece) pairs the opponent can choose without giving me an immediate win
- **Traps**: Moves that _look_ safe but actually lead to forced losses

The weights (2.21 and 0.37) were hand-tuned through trial and error. Not the most scientific approach, but it worked. The idea is simple: **minimize the opponent's breathing room**. Fewer safe options = more mistakes.

### Why This Works

If you've never played Quarto, here's what makes it weird: unlike chess, where you control your own pieces, in Quarto your _opponent_ chooses which piece you place. So the player giving the piece actually has more control than the player placing it.

This means instead of trying to "win positions," the Strangler focuses on **controlling the piece selection**. If I can force the opponent into a situation where _every piece they give me_ is dangerous, I've basically already won even if the board looks neutral to a human.


## Bitboard Representation

One of the first things I did was throw out the object-based board representation and switch to **bitboards**. If you've ever written a chess engine, you know the drill.

Instead of storing a `Piece` object at each square, I use _five integers_:
```java
int tall;    // Bit i is set if square i has a tall piece
int round;   // Bit i is set if square i has a round piece
int solid;   // Bit i is set if square i has a solid piece
int dark;    // Bit i is set if square i has a dark piece
int occupied; // Bit i is set if square i is filled
```

Each piece has 4 binary attributes (tall/short, round/square, solid/hollow, dark/light), which map perfectly to a 4-bit encoding. Attribute checks are now a single bitwise AND operation:

```java
private static boolean isDark(int pieceId) {
    return (pieceId & MASK_DARK) != 0;
}
```

No object lookups, no method calls, no chasing pointers through memory.


## O(1) Danger Mask Calculation

The original version of the Strangler was _slow_. Every time I evaluated a position, I'd loop through all empty squares, loop through all available pieces, and check if placing that piece would create a winning line. That's **O(Empty × Pieces × Lines)**, way too expensive when you're doing it thousands of times per second. The midgame search was taking 5+ seconds per move, which is… not great when you have a time limit.

So I rewrote it using **danger masks**. I was honestly skeptical this would work, but it ended up being the single biggest performance win in the whole project.

Here's the idea: for each attribute (tall, round, solid, dark), I precompute a bitmask of squares where placing a piece with that attribute would _complete a winning line_. Then, to check if a piece is dangerous, I just OR together the four attribute masks:

```java
private int getDangerSquares(int tall, int round, int solid, int dark, 
                              int occupied, int pieceId) {
    int danger = 0;
    danger |= computeDangerMaskForAttr(tall, isTall(pieceId), occupied);
    danger |= computeDangerMaskForAttr(round, isRound(pieceId), occupied);
    danger |= computeDangerMaskForAttr(solid, isSolid(pieceId), occupied);
    danger |= computeDangerMaskForAttr(dark, isDark(pieceId), occupied);
    return danger;
}
```

This drops the safety calculation from **O(Empty × Pieces × Lines)** to **O(Pieces × Lines)**. At depth 5, this optimization alone saved about 70% of evaluation time.


## Iterative Deepening + Aspiration Windows

The Strangler uses iterative deepening, starting at depth 1 and working its way up to depth 5 (or until time runs out).

To speed things up, I added **aspiration windows**: instead of searching with `[-∞, +∞]` bounds, I use a narrow window around the previous iteration's score:

```java
int alpha = previousScore - 50;
int beta = previousScore + 50;
```

If the search fails outside this window, I widen it and re-search. But most of the time, the score stays stable, and the narrow window causes more cutoffs, which means faster searches.


# Phase 2: The God Engine (Perfect Endgame)

Once the board reaches 9 empty squares (or fewer), the Strangler steps aside and the **God Engine** takes over, a brute-force Alpha-Beta solver that just calculates everything to the end of the game tree.

At this point, the game becomes fully solvable. There are at most **9! × 9!** positions left, which sounds huge until you realize…


## Symmetry Reduction (32× State Space Collapse)

Quarto has a _lot_ of symmetry. The board has 8-fold rotational/reflective symmetry (the dihedral group D4), which is standard stuff. But there are also **topological symmetries** — board transformations that preserve winning lines but aren't geometric rotations. These are way less obvious, and it took me a while to even convince myself they were valid.

I combined these into **32 total symmetries** (8 spatial × 4 topological):

```java
private static final int[][] ALL_SYMMETRIES = new int[32][16];
```

Every time I evaluate a position, I compute its **canonical hash**, the minimum hash value across all 32 symmetric variants:

```java
private long computeCanonicalHash(int tall, int round, int solid, int dark, 
                                    int occupied, int pieceToPlace) {
    long minHash = Long.MAX_VALUE;
    int minSym = 0;
    
    for (int sym = 0; sym < 32; sym++) {
        long h = computeHashForSymmetry(sym, ...);
        if (Long.compareUnsigned(h, minHash) < 0) {
            minHash = h;
            minSym = sym;
        }
    }
    
    return (minHash & 0xFFFFFFFFFFFFFFE0L) | (minSym & 0x1F);
}
```

This collapses the state space by up to **32×**. Positions that look completely different to a human are treated as identical by the AI. The transposition table hit rate went from about 20% to 60% after adding this.


## Piece Isomorphism (Because Why Stop There)

But wait, there's _more_ symmetry to exploit.

If the board has mostly dark pieces, I can invert the "dark" bit for every piece and get an equivalent position. This is called **piece isomorphism**.

I detect when an attribute is in the majority and flip it:

```java
private int computeInversionMask(int dark, int tall, int round, int solid, 
                                   int occupied) {
    int mask = 0;
    int darkCount = Integer.bitCount(dark & occupied);
    int count = Integer.bitCount(occupied);
    
    if (darkCount > count / 2) {
        mask |= MASK_DARK;
    }
    // ...repeat for other attributes
    return mask;
}
```

Then I XOR every piece ID with this mask before hashing. This adds another ~2× reduction on top of the geometric symmetries.


## Zobrist Hashing (Fast, Collision-Resistant)

To make symmetry detection fast, I use **Zobrist hashing**, a technique borrowed from chess engines.

Each (square, piece) pair gets a random 64-bit number:

```java
private static final long[][] Z_SQUARE_PIECE = new long[16][16];
private static final long[] Z_NEXT_PIECE = new long[16];
```

The hash of a position is just the XOR of all occupied squares:

```java
long hash = 0;
for (int sq = 0; sq < 16; sq++) {
    if ((occupied & (1 << sq)) != 0) {
        hash ^= Z_SQUARE_PIECE[sq][pieceId];
    }
}
hash ^= Z_NEXT_PIECE[pieceToPlace];
```

XOR is fast, reversible (updating the hash after a move is trivial), and has excellent collision resistance.


## Transposition Table (4 Million Entries)

All those canonical hashes feed into a **transposition table**, a giant lookup table that stores previously searched positions:

```java
private static final int TT_SIZE = 1 << 22; // 4 Million entries
private static final long[] TT_KEYS = new long[TT_SIZE];
private static final long[] TT_VALUES = new long[TT_SIZE];
private static final int[] TT_MOVES = new int[TT_SIZE];
```

Before searching a position, I check if I've seen it before:

```java
int ttIndex = (int)((canonicalHash >>> 5) & (TT_SIZE - 1));

if (TT_KEYS[ttIndex] == canonicalHash) {
    long ttEntry = TT_VALUES[ttIndex];
    int ttDepth = (int)((ttEntry >> 8) & 0xFF);
    int ttScore = (int)(ttEntry >> 16);
    
    if (ttDepth >= depth) {
        // Use stored result instead of re-searching
        return ttScore;
    }
}
```

With the 32× symmetry reduction, the transposition table gets _way_ more hits than it would in a normal search. Positions that were searched in different branches (but are actually the same after symmetry) all map to the same table entry.


## Principal Variation Search (PVS)

The God Engine uses **Principal Variation Search**, an optimization of Alpha-Beta that assumes the first move you try is usually the best one. Sounds risky, but if your move ordering is decent, it pays off big time.

Here's how it works:
1. Search the first move with a full `[alpha, beta]` window
2. Search all remaining moves with a **null window** `[alpha, alpha+1]`
3. If a later move beats `alpha`, re-search it with the full window

```java
if (firstMove) {
    val = -godEngineNegamax(depth-1, -beta, -alpha, ...);
    firstMove = false;
} else {
    // Null window search
    val = -godEngineNegamax(depth-1, -alpha-1, -alpha, ...);
    
    // Re-search if it beats alpha
    if (val > alpha && val < beta) {
        val = -godEngineNegamax(depth-1, -beta, -alpha, ...);
    }
}
```

When move ordering is good (which it usually is, thanks to the transposition table), this causes way more cutoffs than plain Alpha-Beta.


## Late Move Reduction (LMR)

If I've already searched 3+ moves at a node and none of them improved `alpha`, the remaining moves are probably bad. So I search them at **reduced depth**:

```java
int reduction = 0;
if (!firstMove && i >= LMR_THRESHOLD && depth > LMR_DEPTH_THRESHOLD) {
    reduction = 1;
}

val = -godEngineNegamax(depth - 1 - reduction, ...);

// If it beats alpha despite the reduction, re-search at full depth
if (reduction > 0 && val > alpha) {
    val = -godEngineNegamax(depth - 1, ...);
}
```

Late moves almost never matter, and LMR lets me skip most of their subtrees. In practice, this cut the average node count by about 40%. Free performance.

## Move Ordering (The Actual Secret Sauce)

Here's the thing though all these optimizations (PVS, LMR, Alpha-Beta cutoffs) only work if **good moves are searched first**. If I search the best move last, I get zero cutoffs and waste all my time. Move ordering is everything.

So I use **three layers of move ordering**:

1. **Transposition Table Move** (priority: 1,000,000)  
   If I've seen this position before, try the best move from last time first.

2. **Killer Moves** (priority: 50,000 / 40,000)  
   Moves that caused cutoffs at the same depth in other branches.

3. **History Heuristic** (priority: 0–10,000)  
   Moves that have caused cutoffs frequently in the past.

These are combined into a single priority score, and moves are sorted before searching:

```java
for (int i = 1; i < moveCount; i++) {
    int j = i;
    while (j > 0 && movePriorities[j] > movePriorities[j - 1]) {
        // Bubble sort (fine for small arrays)
        swap(moveSqs, j, j-1);
        swap(moveNextPs, j, j-1);
        swap(movePriorities, j, j-1);
        j--;
    }
}
```

With good move ordering, I often get a cutoff on the _first_ move. When that happens, the entire remaining subtree is skipped.


# Dynamic Phase Switching

The last piece of the puzzle: **when do you actually switch from Strangler to God Engine?**

I went with a **dynamic threshold** based on how much time is left:

```java
private int getDynamicEndgameThreshold(long elapsedMs, long timeLimitMs) {
    long remaining = timeLimitMs - elapsedMs;
    if (remaining > 4000) return 11;  // Switch early if we have time
    if (remaining > 2000) return 10;
    return 9;  // Safe default
}
```

If I have plenty of time, I switch to perfect play earlier (11 empty squares). If I'm running low, I wait until 9 empty squares to guarantee the search finishes.

This adaptive strategy means I'm always using the best approach for the current time budget.


# Putting It All Together

Here's the final pipeline:

1. **Opening** (16 empty squares): Pick a balanced piece to give the opponent
2. **Midgame** (15–10 empty squares): Strangler heuristic with iterative deepening
3. **Endgame** (≤9 empty squares): God Engine with perfect Alpha-Beta search
4. **Every move**: Zobrist hashing → Canonical symmetry → Transposition table lookup → Move ordering → PVS + LMR

The result? An AI that plays dirty in the midgame, strangling the opponent's options, and then switches to cold, mathematically perfect play once the endgame is in sight.


# Performance

Some quick numbers:

- **Midgame search** (Strangler, depth 5): ~50,000 nodes/second
- **Endgame search** (God Engine, depth 18): ~200,000 nodes/second (thanks to TT/symmetry)
- **Transposition table hit rate**: ~60% in endgame
- **Average move time**: 0.5–2 seconds

The God Engine is actually _faster_ per node than the Strangler, which I definitely didn't expect going in. Turns out when your transposition table and symmetry reduction are doing their job, you skip so many subtrees that perfect search ends up being cheaper than heuristic search. Weird, right?


# What I'd Do Differently

If I were to rebuild this from scratch:

1. **Use Opening Books**: The first 2–3 moves are always the same. Precomputing optimal openings would save time.

2. **Tune Weights with Machine Learning**: The heuristic weights (2.21, 0.37) were hand-tuned. A genetic algorithm could probably find better values.

3. **Multi-Threaded Search**: The transposition table is already thread-safe-ish. Parallelizing the root move search would be a nice speedup.

4. **Better Time Management**: Right now I use fixed time limits per phase. A more dynamic system (like chess engines use) would be smarter.


# Final Thoughts

Building ChokerJoker took about three weeks of on-and-off work. Most of that time wasn't actually writing the algorithm, it was debugging why the symmetry reduction was breaking certain endgame positions, or staring at logs trying to figure out why the transposition table was returning stale scores.


The full code is 1,739 lines of Java, all in one file. Yes, that probably horrifies proper software engineers, but it made debugging much easier. The bitboards, the Zobrist tables, the symmetry logic, the transposition table everything is right there. No hunting across 15 different classes.

If you're building your own game AI, here's my one piece of advice: spend your time on move ordering. Alpha-Beta is fast, but only if you search good moves first. The difference between random move order and good move order is often 100x in node count.

Anyway, that's ChokerJoker. It wins most of the time, draws sometimes, and loses occasionally when it misjudges the midgame, which is about as good as you can expect from a hybrid strategy.

If you want to check out the full source code, it's all up on GitHub:

👉 **[https://github.com/ramzxy/quarto](https://github.com/ramzxy/quarto)**

---

If you enjoyed this read and want to support more posts like this, consider buying me a beer over at **[ilia.beer](https://ilia.beer)**, I'll even drink it and cheer to you on camera :)
