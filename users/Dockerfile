FROM node

WORKDIR /app/users

COPY package*.json .

RUN npm install
COPY . .

EXPOSE 8001

CMD ["npm", "start"]

# RUN npm run build

# FROM node:16-alpine

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /app

# COPY package*.json .

# RUN npm install --only=production