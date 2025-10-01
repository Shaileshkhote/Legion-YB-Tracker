// GraphQL queries for The Graph subgraph
export const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/122066/yb/version/latest';

export const GET_TOKEN_CLAIMS = `
  query GetTokenClaims($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    tokenClaims(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      investor
      amount
      blockNumber
      transactionHash
      timestamp
      gasPrice
    }
  }
`;

export const GET_REFUNDS = `
  query GetRefunds($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    refunds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      investor
      amount
      blockNumber
      transactionHash
      timestamp
      gasPrice
    }
  }
`;

export const GET_INVESTMENTS = `
  query GetInvestments($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    investments(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      investor
      amount
      blockNumber
      transactionHash
      timestamp
      gasPrice
    }
  }
`;

export const GET_INVESTOR_SUMMARIES = `
  query GetInvestorSummaries($first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    investorSummaries(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      address
      totalClaimed
      totalRefunded
      totalInvested
      claimCount
      refundCount
      investmentCount
      lastClaimed
      lastRefunded
      lastInvested
      firstActivity
      lastActivity
    }
  }
`;

export const GET_SALE_STATUS = `
  query GetSaleStatus {
    saleStatus(id: "sale") {
      id
      totalCapitalInvested
      totalCapitalRaised
      totalCapitalWithdrawn
      totalTokensAllocated
      claimTokensMerkleRoot
      isCanceled
      capitalWithdrawn
      hasEnded
      endTime
      refundEndTime
      lockupEndTime
      vestingStartTime
      askToken
      lastUpdated
    }
  }
`;

export const GET_REFUND_TOTALS = `
  query GetRefundTotals {
    refundTotals(id: "refund-totals") {
      id
      totalRefunded
      totalRefundCount
      uniqueRefundAddresses
      lastUpdated
    }
  }
`;

export const GET_INVESTMENT_TOTALS = `
  query GetInvestmentTotals {
    investmentTotals(id: "investment-totals") {
      id
      totalInvested
      totalInvestmentCount
      uniqueInvestorAddresses
      lastUpdated
    }
  }
`;

export const GET_CLAIM_TOTALS = `
  query GetClaimTotals {
    claimTotals(id: "claim-totals") {
      id
      totalClaimed
      totalClaimCount
      uniqueClaimerAddresses
      lastUpdated
    }
  }
`;

export const GET_USER_COUNTERS = `
  query GetUserCounters {
    userCounters(id: "user-counters") {
      id
      totalInvestmentUsers
      totalRefundUsers
      totalClaimUsers
      lastUpdated
    }
  }
`;

export const GET_ALL_TOTALS = `
  query GetAllTotals {
    userCounters(id: "user-counters") {
      totalInvestmentUsers
      totalRefundUsers
      totalClaimUsers
    }
    investmentTotals(id: "investment-totals") {
      totalInvested
      totalInvestmentCount
      uniqueInvestorAddresses
    }
    refundTotals(id: "refund-totals") {
      totalRefunded
      totalRefundCount
      uniqueRefundAddresses
    }
    claimTotals(id: "claim-totals") {
      totalClaimed
      totalClaimCount
      uniqueClaimerAddresses
    }
  }
`;

export const SEARCH_INVESTORS = `
  query SearchInvestors($address: String!, $first: Int!, $skip: Int!) {
    investorSummaries(
      where: { address_contains: $address }
      first: $first
      skip: $skip
      orderBy: totalClaimed
      orderDirection: desc
    ) {
      id
      address
      totalClaimed
      totalVested
      totalRefunded
      totalInvested
      claimCount
      refundCount
      investmentCount
      lastClaimed
      lastRefunded
      lastInvested
      firstActivity
      lastActivity
    }
  }
`;

// Types for GraphQL responses
export interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{
            line: number;
            column: number;
        }>;
    }>;
}

export interface TokenClaimData {
    id: string;
    investor: string;
    amount: string;
    blockNumber: string;
    transactionHash: string;
    timestamp: string;
    gasPrice: string;
}

export interface RefundData {
    id: string;
    investor: string;
    amount: string;
    blockNumber: string;
    transactionHash: string;
    timestamp: string;
    gasPrice: string;
}

export interface InvestmentData {
    id: string;
    investor: string;
    amount: string;
    blockNumber: string;
    transactionHash: string;
    timestamp: string;
    gasPrice: string;
}

export interface InvestorSummaryData {
    id: string;
    address: string;
    totalClaimed: string;
    totalRefunded: string;
    totalInvested: string;
    claimCount: number;
    refundCount: number;
    investmentCount: number;
    lastClaimed: string | null;
    lastRefunded: string | null;
    lastInvested: string | null;
    firstActivity: string;
    lastActivity: string;
}

export interface SaleStatusData {
    id: string;
    totalCapitalInvested: string;
    totalCapitalRaised: string;
    totalCapitalWithdrawn: string;
    totalTokensAllocated: string;
    claimTokensMerkleRoot: string | null;
    isCanceled: boolean;
    capitalWithdrawn: boolean;
    hasEnded: boolean;
    endTime: string | null;
    refundEndTime: string | null;
    lockupEndTime: string | null;
    vestingStartTime: string | null;
    askToken: string | null;
    lastUpdated: string;
}

export interface RefundTotalsData {
    id: string;
    totalRefunded: string;
    totalRefundCount: string;
    uniqueRefundAddresses: string;
    lastUpdated: string;
}

export interface InvestmentTotalsData {
    id: string;
    totalInvested: string;
    totalInvestmentCount: string;
    uniqueInvestorAddresses: string;
    lastUpdated: string;
}

export interface ClaimTotalsData {
    id: string;
    totalClaimed: string;
    totalClaimCount: string;
    uniqueClaimerAddresses: string;
    lastUpdated: string;
}

export interface UserCountersData {
    id: string;
    totalInvestmentUsers: string;
    totalRefundUsers: string;
    totalClaimUsers: string;
    lastUpdated: string;
}

export interface AllTotalsData {
    userCounters: {
        totalInvestmentUsers: string;
        totalRefundUsers: string;
        totalClaimUsers: string;
    } | null;
    investmentTotals: {
        totalInvested: string;
        totalInvestmentCount: string;
        uniqueInvestorAddresses: string;
    } | null;
    refundTotals: {
        totalRefunded: string;
        totalRefundCount: string;
        uniqueRefundAddresses: string;
    } | null;
    claimTotals: {
        totalClaimed: string;
        totalClaimCount: string;
        uniqueClaimerAddresses: string;
    } | null;
}
