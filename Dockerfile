FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN tsc

# Expose port
EXPOSE 5000

# Run compiled JavaScript
CMD ["node", "dist/index.js"]
