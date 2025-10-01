# Legion Token Tracker Subgraph

This subgraph indexes events from the Legion.cc sale contract on Ethereum mainnet.

## Contract Information

- **Contract Address**: `0x28be6260dbb7872de5effc9a4a73c85b7405a8c0`
- **Network**: Ethereum Mainnet
- **Start Block**: 19000000 (approximate)

## Events Indexed

- `TokenAllocationClaimed` - When investors claim their token allocations
- `CapitalRefunded` - When investors receive refunds
- `CapitalInvested` - When investors make investments
- `SaleEnded` - When the sale ends
- `CapitalRaisedPublished` - When total capital raised is published
- `SaleResultsPublished` - When sale results are published

## Entities

### TokenClaim
- Individual token claim events
- Tracks amount claimed immediately and amount to be vested

### Refund
- Individual refund events
- Tracks refund amounts per investor

### Investment
- Individual investment events
- Tracks investment amounts per investor

### InvestorSummary
- Aggregated data per investor address
- Includes totals for claims, refunds, and investments
- Tracks activity counts and timestamps

### SaleStatus
- Overall sale status and configuration
- Tracks sale state, totals, and important timestamps

## Deployment

1. **Install Graph CLI**:
   ```bash
   npm install -g @graphprotocol/graph-cli
   ```

2. **Authenticate with The Graph**:
   ```bash
   graph auth --studio <your-access-token>
   ```

3. **Deploy the subgraph**:
   ```bash
   ./deploy.sh
   ```

## GraphQL Queries

### Get Token Claims
```graphql
query GetTokenClaims {
  tokenClaims(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    investor
    amountToBeVested
    amountOnClaim
    vesting
    timestamp
    transactionHash
  }
}
```

### Get Refunds
```graphql
query GetRefunds {
  refunds(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    investor
    amount
    timestamp
    transactionHash
  }
}
```

### Get Investor Summaries
```graphql
query GetInvestorSummaries {
  investorSummaries(first: 100, orderBy: totalClaimed, orderDirection: desc) {
    id
    address
    totalClaimed
    totalVested
    totalRefunded
    totalInvested
    claimCount
    refundCount
    investmentCount
  }
}
```

### Search Investors
```graphql
query SearchInvestors($address: String!) {
  investorSummaries(where: { address_contains: $address }) {
    id
    address
    totalClaimed
    totalRefunded
    totalInvested
  }
}
```

## Integration

The subgraph provides a GraphQL API that can be queried from the frontend application. Update the `GRAPH_ENDPOINT` in `lib/graphql.ts` with your deployed subgraph URL.

## Development

- **Code Generation**: `npm run codegen`
- **Build**: `npm run build`
- **Deploy**: `npm run deploy`

## Monitoring

Monitor your subgraph at:
- [The Graph Studio](https://thegraph.com/studio/)
- [Hosted Service](https://thegraph.com/hosted-service/)
