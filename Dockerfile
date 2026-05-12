FROM node:18-alpine

WORKDIR /app

# Install ts-node and typescript globally
RUN npm install -g ts-node typescript

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

# Use ts-node to run TypeScript directly
CMD ["ts-node", "src/index.ts"]
