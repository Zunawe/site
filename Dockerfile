FROM node:16

WORKDIR /opt/app
COPY . .
RUN npm ci

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
