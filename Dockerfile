FROM node:18
RUN chmod 1777 /tmp
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx playwright install
RUN npx playwright install-deps
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]