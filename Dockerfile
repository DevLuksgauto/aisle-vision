FROM node:20-alpine

WORKDIR /app

# Copiar arquivos necessários
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY dist ./dist
COPY tsconfig.json ./
COPY nest-cli.json ./

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]