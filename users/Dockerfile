FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install -g nodemon
COPY . .

CMD ["nodemon"]

# RUN npm run build

# FROM node:16-alpine

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /app

# COPY package*.json .

# RUN npm install --only=production