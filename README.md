## STG audEERING W2V2 Component

> [!WARNING]
> This isn't a final version of the API. In the future, the format of responses and requests will be converted to protobuf.

Uses fine-tuned W2V2 onnx model by audEERING to perform recognize gender by audio.

## How to Run?

Before all other guides

1. Clone this repo:

```bash
git clone https://github.com/VayloAI/component-template
```

2. Install nats-server. Enable jetstream and configure `max_payload` to 4MB
3. Install PostgreSQL 16+
4. Install Redis 6.2+
5. [Download](https://zenodo.org/records/7761387) 6/24 layers model converted to onnx
6. Create `/src/tasks/model` folder and put model file there

### With Docker?

1. Install Docker
2. Build image:

for subscribers

```bash
docker build -t subcriber-stg --build-arg SERVICE=sub:stg .
```

for server

```bash
docker build -t stg-backend --build-arg SERVICE=start:cold .
```

3. Run

```bash
docker run --network host subcriber-stg
```

### Without Docker

1. Install Bun
2. Configure `.env` if need
3. Run

for subscribers

```bash
bun sub:stg
```

for server

```bash
bun start:cold
```

## Requirements

- Bun
- NATS (enable jetstream and configure `max_payload` to 4MB)
- PostgreSQL
- Redis
