FROM node:14-alpine AS build
WORKDIR /opt
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile
COPY . .
RUN yarn run build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /opt/dist /usr/share/nginx/html
