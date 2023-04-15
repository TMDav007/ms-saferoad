FROM node:alpine

WORKDIR /app/notifications

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm", "start"]

