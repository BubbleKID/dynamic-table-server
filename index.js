const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const KoaQs = require('koa-qs');
const send = require('koa-send');

const { trades } = require('./trades.json');

const myTrades = trades.map((trade) => {
  const { updatedAt } = trade;

  return {
    ...trade,
    updatedAt: (new Date(updatedAt)).getTime(),
  };
});

const { withdraws } = require('./withdraws.json');

const myWithdraws = withdraws.map((trade) => {
  const { createdAt } = trade;

  return {
    ...trade,
    createdAt: (new Date(createdAt)).getTime(),
  };
});

const app = new Koa();
const router = new Router();

const pathOf = (string, obj) => {
  const separator = '.';

  const keys = string.split(separator);

  const [key, ...rest] = keys;

  if (!obj) {
    return null;
  }

  const val = obj[key];

  if (rest.length) {
    return pathOf(rest.join(separator), val);
  }

  return val;
};

const prepareFilters = (...filters) => filters
  .map(([key, value]) => ({
    key,
    value,
  }))
  .filter(({ value }) => !!value);

const isFilteredItem = item => (filters, cb) => filters
  .every(({ key, value }) => cb(pathOf(key, item), value));

router.get('/', async (ctx) => {
  await send(ctx, './index.html');
});

router.get('/withdraws.json', (ctx) => {
  const {
    pagination = {},
    filter = {},
  } = ctx.query;

  const {
    number = 1,
    size = 10,
  } = pagination;

  const {
    uuid,
    createdAt: {
      lte: createdAtLte,
      gte: createdAtGte,
    } = {},
    amount,
    status,
    bankReferenceNumber,
  } = filter;

  const gtes = prepareFilters(
    ['createdAt', (new Date(createdAtGte)).getTime()],
  );
  const ltes = prepareFilters(
    ['createdAt', (new Date(createdAtLte)).getTime()],
  );

  const eqls = prepareFilters(
    ['uuid', uuid],
    ['amount', amount],
    ['bankReferenceNumber', bankReferenceNumber],
  );

  const inqs = prepareFilters(
    ['status', status],
  );

  const thisWithdraws = myWithdraws
    .filter((trade) => {
      const isFiltered = isFilteredItem(trade);

      const isEql = isFiltered(eqls, (value, filterValue) => value === filterValue);
      const isInq = isFiltered(inqs, (value, filterValue) => filterValue.includes(value));
      const isGte = isFiltered(gtes, (value, filterValue) => value >= filterValue);
      const isLte = isFiltered(ltes, (value, filterValue) => value <= filterValue);

      return isEql && isInq && isGte && isLte;
    });

  const paginatedWithdraws = thisWithdraws.slice((number - 1) * size, number * size);

  ctx.body = {
    trades: paginatedWithdraws,
    pagination: {
      number,
      size,
      total: thisWithdraws.length,
    },
    option: {
      status: ['PROCESSED', 'REJECTED'],
    },
    filter,
  };
});

router.get('/trades.json', (ctx) => {
  const {
    pagination = {},
    filter = {},
  } = ctx.query;

  const {
    number = 1,
    size = 10,
  } = pagination;

  const {
    uuid,
    volume,
    price,
    updatedAt: {
      lte: updatedAtLte,
      gte: updatedAtGte,
    } = {},
    side,
    tradingPair: {
      symbol: {
        inq: tradingPairSymbolInq,
      } = {},
    } = {},
  } = filter;

  const eqls = prepareFilters(
    ['uuid', uuid],
    ['price', price],
    ['volume', volume],
  );

  const inqs = prepareFilters(
    ['side', side],
    ['tradingPair.symbol', tradingPairSymbolInq],
  );

  const gtes = prepareFilters(
    ['updatedAt', (new Date(updatedAtGte)).getTime()],
  );

  const ltes = prepareFilters(
    ['updatedAt', (new Date(updatedAtLte)).getTime()],
  );

  const thisTrades = myTrades
    .filter((trade) => {
      const isFiltered = isFilteredItem(trade);

      const isEql = isFiltered(eqls, (value, filterValue) => value === filterValue);
      const isInq = isFiltered(inqs, (value, filterValue) => filterValue.includes(value));
      const isGte = isFiltered(gtes, (value, filterValue) => value >= filterValue);
      const isLte = isFiltered(ltes, (value, filterValue) => value <= filterValue);

      return isEql && isInq && isGte && isLte;
    });

  const paginatedTrades = thisTrades.slice((number - 1) * size, number * size);

  ctx.body = {
    trades: paginatedTrades,
    pagination: {
      number,
      size,
      total: thisTrades.length,
    },
    option: {
      tradingPair: {
        symbol: ['BTC/AUD', 'ETH/AUD', 'ETH/BTC'],
      },
      side: ['ASK', 'BID'],
    },
    filter,
  };
});

app
  .use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
  })
  .use(BodyParser())
  .use(router.routes(), router.allowedMethods());

const PORT = process.env.PORT || 3000;
KoaQs(app, 'extended').listen(PORT, () => console.info(`Listening on port ${PORT}`));
