# Use the official Node.js 22 Alpine image as the base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json .
COPY package-lock.json .

# Install project dependencies
RUN npm install && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Run the build script defined in package.json
RUN npm run build

# Expose the desired port
EXPOSE 8190

# (Optional) List files for debugging purposes
RUN ls -a

# Define the command to run your application
CMD ["node", "./dist/index.js"]
