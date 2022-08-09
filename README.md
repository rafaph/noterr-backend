# Noterr Backend

## Usage

1. Start container:

```
make up
```

2. Install dependencies:

```
make shell
npm i
```

3. Run an any desired npm script:

```
npm run start
npm run test
npm run test:watch
npm run test:cov
npm run lint
npm run lint:fix
npm run build
npm run build:watch
```

Obs: lint:fix also formats your code using prettier.

4. Remove container:

```
make down
```

## License

MIT
