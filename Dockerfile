# Step 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency configuration
COPY package.json ./
# Clean install dependencies
RUN npm install

# Copy source and configurations
COPY . .

# Build to static assets
RUN npm run build

# Step 2: Serve the assets using Nginx
FROM nginx:alpine

# Copy Nginx SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose container port (Cloud Run defaults to serving on port 8080, but can be configured. We will configure Nginx to listen on port 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
