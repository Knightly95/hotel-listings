FROM node:22-alpine AS build
WORKDIR /app
# The Cypress binary is only needed to run end-to-end tests, not to build.
ENV CYPRESS_INSTALL_BINARY=0
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
