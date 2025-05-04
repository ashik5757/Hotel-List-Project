# Use Node.js base image
FROM node:18-alpine

# Create working directory
WORKDIR /app

# Copy dependencies and install
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose the frontend dev server
EXPOSE 3000

# Start React app (Vite or CRA)
CMD ["npm", "run", "dev"]
