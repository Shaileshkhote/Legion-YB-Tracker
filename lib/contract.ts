// Contract address on Ethereum mainnet
export const CONTRACT_ADDRESS = '0x28be6260dbb7872de5effc9a4a73c85b7405a8c0';

// TypeScript interfaces for our data
export interface ClaimSummary {
    address: string;
    totalClaimed: string;
    claimCount: number;
    lastClaimed: number;
}

export interface RefundSummary {
    address: string;
    totalRefunded: string;
    refundCount: number;
    lastRefunded: number;
}

export interface InvestmentSummary {
    address: string;
    totalInvested: string;
    investmentCount: number;
    lastInvested: number;
}