# WeedControl API

## Running the application

```bash
# Instaling dependencies
$ npm install

# Running in development
$ docker-compose -f docker-compose.dev.yaml up

# Running in production
$ docker-compose up -d

# Migrating and seeding
docker exec -it agrodrones-api npx prisma migrate reset
```
