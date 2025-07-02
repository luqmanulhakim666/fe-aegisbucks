FROM node:20.11.1-bullseye

WORKDIR /app

COPY . .

RUN npm install --omit=dev && npm run build

EXPOSE 3001
CMD ["npm", "run", "start"]
