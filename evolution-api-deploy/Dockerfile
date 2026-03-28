FROM atendai/evolution-api:v2.3.7

WORKDIR /evolution

CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/postgresql-schema.prisma && node dist/main.js"]
