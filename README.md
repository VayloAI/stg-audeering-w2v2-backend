## component-template

This is a generic component template for Vaylo backend. This provides the basis for easily creating your own Vaylo AI model backend

## How to use?

1. Clone this repo:

```bash
git clone https://github.com/VayloAI/component-template
```

2. Install Bun

3. Install depends

```bash
bun install
```

4. Update `./src/config.ts` (and `.env` if needed) with your project-specific info

5. Implement your STT / STG / TTS / Translate model logic in `./src/tasks/<filename>` (filename can be `stt`, `tts`, `stg` or `translate`)

6. Create DB schema in `./src/schemas/<filename>` and implement your DB logic in `./src/database/repositories/<filename>`, also create migrations in `./src/database/migrations/<YYYY>-<MM>-<DD>-<desc>`

7. Implement your Cache logic in `./src/cache/repositories/<filename>`

8. Create facade for your DB & Cache logic in `./src/facades/<filename>`

9. Upload to GitHub

## How to Run?

### With Docker?

1. Install Docker
2. Build image:

for subscribers

```bash
docker build -t subcriber-custom --build-arg SERVICE=sub:custom .
```

for server

```bash
docker build -t example-backend --build-arg SERVICE=start:cold .
```

3. Run

```bash
docker run --network host subcriber-custom
```

### Without Docker

1. Install Bun
2. Run

for subscribers

```bash
bun sub:custom
```

for server

```bash
bun start:cold
```

## Requirements

- Bun
- NATS
- PostgreSQL
- Redis
