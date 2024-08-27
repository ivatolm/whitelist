FROM node:18

RUN apt-get update && apt-get install -y iptables

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
