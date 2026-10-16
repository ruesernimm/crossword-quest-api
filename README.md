# Crossword Quest API

Backend API for Crossword Quest, a tournament game for the SorSU Bulan Campus library. 
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Ruth Angel L. Gueta (ruesernimm), BSCS 3-1
- Group and game concept: Group 6 Crossword Quest

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player is considered to have completed the game when they stay until the game ends and correctly solve at least one word, earning points that contribute to their final leaderboard ranking. Since Crossword Quest is a free-for-all race, players can answer any unsolved clue at any time, while players who leave early without solving any words are marked as completed = false with a score of 0.

## Tables

| # | Table | Description |
|---|---|---|
| 1 | hosts | Instructors who run games (username, password_hash) |
| 2 | question_sets | A named set of clues |
| 3 | crossword_grids | The grid layout (size) used by a game |
| 4 | game_sessions | One game with its join code, shareable link, status (WAITING, PLAYING, FINISHED), start and end times |
| 5 | players | A user's seat in a game with nickname, color, token, score and streak (one seat per account per game) |
| 6 | clues | 	Clue text, answer, direction and grid position, belongs to a question set |
| 7 | device_info | Platform and browser of each player |
| 8 | solved_words | Which player solved which clue, and the points awarded |
| 9 | users | Accounts (school_id, full_name, email, role), added by Design Change Notice 01. A later migration, add-user-id-to-players, links each player to a user | 
 

## Database scripts


| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |


Project: Crossword Quest API
Created for CS 313 Software Engineering 1.