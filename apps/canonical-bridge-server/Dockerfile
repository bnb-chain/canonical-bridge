FROM busybox:1.36.1 as builder
FROM node:20-buster

WORKDIR /opt/deploy

RUN useradd -u 9000 appuser
USER appuser

COPY . .
RUN node common/scripts/install-run-rush.js install -t canonical-bridge-server
RUN node common/scripts/install-run-rush.js build -t canonical-bridge-server

COPY --from=builder /bin/sleep /usr/local/bin/sleep

WORKDIR /opt/deploy/apps/canonical-bridge-server

EXPOSE 3000

ENV NODE_ENV production

CMD ["yarn", "start"]
