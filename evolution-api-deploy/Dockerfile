FROM atendai/evolution-api:latest

WORKDIR /evolution

CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/postgresql-schema.prisma && node dist/main.js"]
