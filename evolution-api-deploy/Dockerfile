FROM atendai/evolution-api:v2.2.3

WORKDIR /evolution

CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/postgresql-schema.prisma && node dist/main.js"]
