FROM busybox:1.36.1 as builder
FROM node:20-alpine

WORKDIR /opt/deploy

COPY common/deploy .
COPY --from=builder /bin/sleep /usr/local/bin/sleep

WORKDIR /opt/deploy/apps/canonical-bridge-ui

EXPOSE 3000

ENV NODE_ENV production

CMD [ "yarn", "start"]
