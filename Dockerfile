# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
# package*.json 把package文件移除，以防依赖的版本无法更改
COPY package*.json ./
#初始化项目必备
RUN npm i --legacy-peer-deps
RUN npm i eslint-plugin-vue
#运行命令npm install
RUN npm install
COPY . .
RUN npm run build



# production stage
FROM nginx:stable-alpine as production-stage

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]