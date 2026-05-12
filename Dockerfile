FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose port
EXPOSE 5000

# Run compiled JavaScript
CMD ["node", "dist/index.js"]
