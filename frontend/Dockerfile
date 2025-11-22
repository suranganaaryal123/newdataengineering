# ---- Build Stage ----
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Copy .env file before build so React picks up environment variables
COPY .env .
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copy build output to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
