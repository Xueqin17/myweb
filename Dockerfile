
# Use an official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy app files
COPY . .

# Install dependencies
RUN npm install

# Start app
CMD ["npm", "run", "dev"]