# Pull the official Node.js v18.20.4 image
FROM node:18.20.4 as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY medical-assistant-frontend/package.json /app/
COPY medical-assistant-frontend/package-lock.json /app/
RUN npm install

# Copy the React project files
COPY ./medical-assistant-frontend /app/

# Build the React project
RUN npm run build

# Serve the build with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
