# Use Node.js as the base image for the build stage
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
# COPY package*.json ./
# Copy the remaining files to the container
COPY . ./

# Install the required packages
RUN npm install

# Expose port 8081 to the host machine
EXPOSE 8081

# Build the API application
CMD ["npm", "start"]