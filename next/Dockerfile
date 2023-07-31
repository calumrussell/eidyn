FROM node:18

WORKDIR /app
COPY ./ .
RUN yarn install
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn run build

EXPOSE 3000
ENV PORT 3000
CMD ["yarn", "run", "start"]
