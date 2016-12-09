FROM node:argon
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY dms2dd.js /usr/src/app
EXPOSE 8080
CMD ["npm", "start"]

