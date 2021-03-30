### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:10-alpine as builder

# Install JAVA 8
RUN apk add --no-cache openjdk8

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

# Generate and send SonarQube report
RUN npm run sonar

## Build the angular app in production mode and store the artifacts in dist folder

# RUN npm run ng build:dev -- -c=dev --output-path=dist
RUN npm run build:{{DEPLOYMENT_ENV}}

# Delete node_modules
RUN rm -rf ./node_modules

### STAGE 2: Setup ###

FROM nginx:1.17.9-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
