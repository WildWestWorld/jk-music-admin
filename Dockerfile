# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
# package*.json 把package文件移除，以防依赖的版本无法更改
COPY package*.json ./
#运行命令npm install
RUN npm install
COPY . .
RUN npm run build



# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]