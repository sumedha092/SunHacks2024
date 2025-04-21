# Use an official Node.js runtime as the base image
FROM node:22-slim

# Set the working directory in the Docker image
WORKDIR /usr/source/app

# Copy package.json to install dependencies
COPY package.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code, excluding db, src, and lib
COPY . .

# Expose the port that the app runs on
EXPOSE 6969

# Start the application using the existing start:prod script
CMD ["npm", "run", "start"]