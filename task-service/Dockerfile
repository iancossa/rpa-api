FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=5002
EXPOSE 5002
CMD [ "npm", "start" ]