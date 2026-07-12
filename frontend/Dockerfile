FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=development

EXPOSE 1030

CMD ["npx","ng","serve","--host","0.0.0.0","--port","1030","--configuration","docker","--allowed-hosts"] 