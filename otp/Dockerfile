FROM node:alpine

WORKDIR /app/otp

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8005

CMD ["npm", "start"]

