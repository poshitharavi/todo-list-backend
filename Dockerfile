# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package*.json files
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000 to the docker host, so we can access it from the outside
EXPOSE 3000

# Run app.js when the container launches
CMD ["npm", "run", "start:dev"]
