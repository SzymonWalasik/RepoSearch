FROM node:20.15-alpine as build
WORKDIR /app
COPY . /app/
RUN npm ci
RUN npm run build

FROM nginx:1.27.0-alpine
COPY --from=build /app/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]