# Canonical bridge server

The main function of this service is to dynamically obtain and cache the data of third-party bridges
and provide cryptocurrency prices.

## Preparation

The cryptocurrency prices are provided by
[coinmarketcap](https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest),
so you need to apply for a cmc api key. In addition, we also use redis to cache the data and mysql
for persistent storage, so before starting the service, you need to prepare the corresponding
configurations.

## How to start

1. Copy `env.example` and rename it to `.env`, overwriting with your own configurations

2. Install dependencies

```bash
rush install
```

3. Build local dependencies

```bash
rush build -T .
```

4. Create tables

```bash
rushx prisma:migrate:div
```

5. Run

```bash
rushx start:dev
```

6. Open the [swagger page](http://localhost:3000/api) and you can see all the provided APIs
