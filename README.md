# Table - Code Test Server

## /trades.json

```json
{
  "trades": [{
    "uuid": "693ff034-b28e-450e-a269-1628b7400415",
    "createdAt": "1533008718000",
    "updatedAt": "1553946222000",
    "side": "ASK",
    "volume": "0.6",
    "price": "5692.23",
    "tradingPair": {
      "uuid": "345d3f5d-c90f-47cc-b0b0-4b0f06e6b3af",
      "symbol": "BTC/AUD"
    }
  }],
  "option": {
    "tradingPair": {
      "symbol": ["BTC/AUD", "ETH/AUD", "ETH/BTC"]
    },
    "side": ["ASK", "BID"]
  },
  "pagination": {
    "number": 1,
    "size": 10,
    "total": 100
  },
  "filter": {
    "side": {
      "inq": ["ASK"]
    },
    "createdAt": {
      "gte": "01/01/2018",
      "lte": "31/12/2019"
    },
    "tradingPair": {
      "symbol": {
        "inq": ["BTC/AUD", "BTC/ETH"]
      }
    }
  }
}
```

### Table

- Col: Uuid, Updated at, Side, Volume, Price, Trading pair symbol
- Filter: Side, Trading pair symbol
- Search: Uuid, Volume, Price
- Search by range: Updated at
- Pagination

## /withdraws.json

```json
{
  "withdraws": [{
    "uuid": "98210ff8-1edc-4f72-b21c-28879c4ec650",
    "createdAt": "2019-03-26T05:48:44.803Z",
    "amount": "200.89",
    "status": "PROCESSED",
    "bankReferenceNumber": "JEWELERY"
  }],
  "option": {
    "status": ["PROCESSED", "REJECTED"]
  },
  "pagination": {
    "number": 1,
    "size": 10,
    "total": 100
  },
  "filter": {
    "createdAt": {
      "gte": "01/01/2018",
      "lte": "31/12/2019"
    },
   "bankReferenceNumber": "JEWELERY" 
  }
}
```

### Table

- Col: Uuid, Created at, Status, Amount, Bank reference number
- Filter: Status
- Search: Uuid, Amount, Bank reference number
- Search by range: Created at
- Pagination

# Examples

`/trades.json?filter[createdAt][gte]=2018-01-01&&filter[created][lte]=2018-12-31&&filter[tradingPair][symbol][inq]=BTC/AUD&&filter[tradingPair][symbol][inq]=ETH/AUD&&number=3&&pagination[size]=5`

Search trades that createdAt in the range `2018-01-01` - `2018-12-31` and tradingPair's symbol includes `BTC/AUD` and `ETH/AUD`, and use pagination `{number: 3, size: 5}`

`/withdraws.json?filter[uuid]=98210ff8-1edc-4f72-b21c-28879c4ec650`

Search withdraws that uuid is `98210ff8-1edc-4f72-b21c-28879c4ec650`, and use default pagination `{number: 1, size: 10}`

## Test

Write an application by **React**, the implementation should do the following:

- Two different pages `/trades` and `/withdraws`
- Dynamic table includes pagination and filter (Use option from return body)
- Apply search and reset
- Instructions on how to run the app locally in your README.md. Total time taken to build the app in you README.md
- Persistance result on user refresh page
