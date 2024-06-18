FROM busybox:1.36.1 as builder
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /opt/deploy

COPY common/deploy .
COPY --from=builder /bin/sleep /usr/local/bin/sleep

WORKDIR /opt/deploy/apps/multichain-bridge-ui

EXPOSE 3000

ENV NODE_ENV production

CMD [ "./node_modules/next/dist/bin/next", "start", "--keepAliveTimeout", "70000"]
