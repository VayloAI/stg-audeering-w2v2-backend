## STG audEERING W2V2 Component

> [!WARNING]
> This isn't a final version of the API. In the future, the format of responses and requests will be converted to protobuf.

Uses fine-tuned W2V2 onnx model by audEERING to perform recognize gender by audio.

## Requirements

- Bun
- NATS (enable jetstream and configure `max_payload` to 4MB)
- PostgreSQL
- Valkey/Redis

## How to Run?

Before all other guides

1. [Download](https://zenodo.org/records/7761387) 6/24 layers model converted to onnx
2. Create `/src/tasks/model` folder and put model file there

### With Docker

1. Install Docker
2. Build Docker compose:

```bash
docker compose build
```

3. Run Docker compose:

```bash
docker compose up -d
```

### Without Docker

1. Install Bun
2. Clone this repo:

```bash
git clone https://github.com/VayloAI/component-template
```

3. Install PostgreSQL 16+
4. Install Valkey 8+
5. Install Nats Server. Enable jetsream and configure `max_payload` to 4MB
6. Configure `.env` if need
7. Run

for subscribers

```bash
bun sub:stg
```

for server

```bash
bun start:cold
```
