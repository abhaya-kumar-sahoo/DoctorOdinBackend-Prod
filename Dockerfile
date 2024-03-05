# Use Node.js LTS version as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .



# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
