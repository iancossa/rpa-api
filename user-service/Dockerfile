FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=5001
EXPOSE 5001
CMD [ "npm", "start" ]