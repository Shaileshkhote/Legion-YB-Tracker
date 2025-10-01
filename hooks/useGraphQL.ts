'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    GRAPH_ENDPOINT,
    GET_TOKEN_CLAIMS,
    GET_REFUNDS,
    GET_INVESTMENTS,
    GET_INVESTOR_SUMMARIES,
    GET_SALE_STATUS,
    GET_REFUND_TOTALS,
    GET_INVESTMENT_TOTALS,
    GET_CLAIM_TOTALS,
    GET_USER_COUNTERS,
    GET_ALL_TOTALS,
    SEARCH_INVESTORS,
    GraphQLResponse,
    TokenClaimData,
    RefundData,
    InvestmentData,
    InvestorSummaryData,
    SaleStatusData,
    RefundTotalsData,
    InvestmentTotalsData,
    ClaimTotalsData,
    UserCountersData,
    AllTotalsData
} from '@/lib/graphql';

interface UseGraphQLReturn {
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    isConnected: boolean;
}

interface UseTokenClaimsReturn extends UseGraphQLReturn {
    claims: TokenClaimData[];
    summaries: InvestorSummaryData[];
    totals: {
        totalClaimed: string;
        totalVested: string;
        totalClaims: number;
        uniqueAddresses: number;
    };
}

interface UseRefundsReturn extends UseGraphQLReturn {
    refunds: RefundData[];
    summaries: InvestorSummaryData[];
    totals: {
        totalRefunded: string;
        totalRefunds: number;
        uniqueAddresses: number;
    };
}

interface UseInvestmentsReturn extends UseGraphQLReturn {
    investments: any[];
    summaries: InvestorSummaryData[];
    totals: {
        totalInvested: string;
        totalInvestments: number;
        uniqueAddresses: number;
    };
}

// Generic GraphQL query function
async function queryGraphQL<T>(query: string, variables: any = {}): Promise<GraphQLResponse<T>> {
    const response = await fetch(GRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Hook for token claims
export function useTokenClaims(): UseTokenClaimsReturn {
    const [claims, setClaims] = useState<TokenClaimData[]>([]);
    const [summaries, setSummaries] = useState<InvestorSummaryData[]>([]);
    const [claimTotals, setClaimTotals] = useState<ClaimTotalsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            // Fetch token claims and totals in parallel
            const [claimsResponse, totalsResponse] = await Promise.all([
                queryGraphQL<{ tokenClaims: TokenClaimData[] }>(
                    GET_TOKEN_CLAIMS,
                    {
                        first: 1000,
                        skip: 0,
                        orderBy: 'timestamp',
                        orderDirection: 'desc'
                    }
                ),
                queryGraphQL<{ claimTotals: ClaimTotalsData | null }>(GET_CLAIM_TOTALS)
            ]);

            if (claimsResponse.errors) {
                throw new Error(claimsResponse.errors[0].message);
            }

            if (totalsResponse.errors) {
                throw new Error(totalsResponse.errors[0].message);
            }

            setClaims(claimsResponse.data.tokenClaims);
            setClaimTotals(totalsResponse.data.claimTotals);
            setIsConnected(true);

            // Fetch investor summaries for claims (limited to 1000 due to Graph Protocol limits)
            const summariesResponse = await queryGraphQL<{ investorSummaries: InvestorSummaryData[] }>(
                GET_INVESTOR_SUMMARIES,
                {
                    first: 1000,
                    skip: 0,
                    orderBy: 'totalClaimed',
                    orderDirection: 'desc'
                }
            );

            if (summariesResponse.errors) {
                throw new Error(summariesResponse.errors[0].message);
            }


            setSummaries(summariesResponse.data.investorSummaries);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch token claims');
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Use aggregate totals from subgraph if available, otherwise calculate from raw data
    const totals = claimTotals ? {
        totalClaimed: claimTotals.totalClaimed,
        totalVested: '0', // Not available in simplified schema
        totalClaims: parseInt(claimTotals.totalClaimCount) || 0,
        uniqueAddresses: parseInt(claimTotals.uniqueClaimerAddresses) || 0
    } : {
        totalClaimed: claims.reduce((sum, claim) => (BigInt(sum) + BigInt(claim.amount)).toString(), '0'),
        totalVested: '0', // Not available in simplified schema
        totalClaims: claims.length,
        uniqueAddresses: new Set(claims.map(claim => claim.investor.toLowerCase())).size
    };

    // Create summaries from raw claims data for table display
    const claimSummaries = useMemo(() => {
        const summaryMap = new Map<string, any>();

        claims.forEach(claim => {
            const address = claim.investor.toLowerCase();
            const existing = summaryMap.get(address);

            if (existing) {
                existing.totalClaimed = (BigInt(existing.totalClaimed) + BigInt(claim.amount)).toString();
                existing.claimCount += 1;
                existing.lastClaimed = Math.max(existing.lastClaimed, parseInt(claim.timestamp));
            } else {
                summaryMap.set(address, {
                    address: claim.investor,
                    totalClaimed: claim.amount,
                    claimCount: 1,
                    lastClaimed: claim.timestamp
                });
            }
        });

        return Array.from(summaryMap.values()).sort((a, b) =>
            BigInt(b.totalClaimed) > BigInt(a.totalClaimed) ? 1 : -1
        );
    }, [claims]);

    return {
        claims,
        summaries: claimSummaries,
        totals,
        loading,
        error,
        refetch: fetchData,
        isConnected
    };
}

// Hook for refunds
export function useRefunds(): UseRefundsReturn {
    const [refunds, setRefunds] = useState<RefundData[]>([]);
    const [summaries, setSummaries] = useState<InvestorSummaryData[]>([]);
    const [refundTotals, setRefundTotals] = useState<RefundTotalsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            // Fetch refunds and totals in parallel
            const [refundsResponse, totalsResponse] = await Promise.all([
                queryGraphQL<{ refunds: RefundData[] }>(
                    GET_REFUNDS,
                    {
                        first: 1000,
                        skip: 0,
                        orderBy: 'timestamp',
                        orderDirection: 'desc'
                    }
                ),
                queryGraphQL<{ refundTotals: RefundTotalsData | null }>(GET_REFUND_TOTALS)
            ]);

            if (refundsResponse.errors) {
                throw new Error(refundsResponse.errors[0].message);
            }

            if (totalsResponse.errors) {
                throw new Error(totalsResponse.errors[0].message);
            }

            setRefunds(refundsResponse.data.refunds);
            setRefundTotals(totalsResponse.data.refundTotals);
            setIsConnected(true);

            // Fetch investor summaries for refunds (limited to 1000 due to Graph Protocol limits)
            const summariesResponse = await queryGraphQL<{ investorSummaries: InvestorSummaryData[] }>(
                GET_INVESTOR_SUMMARIES,
                {
                    first: 1000,
                    skip: 0,
                    orderBy: 'totalRefunded',
                    orderDirection: 'desc'
                }
            );

            if (summariesResponse.errors) {
                throw new Error(summariesResponse.errors[0].message);
            }


            setSummaries(summariesResponse.data.investorSummaries);

        } catch (err) {
            console.error('Error fetching refunds:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch refunds');
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Use aggregate totals from subgraph if available, otherwise calculate from raw data
    const totals = refundTotals ? {
        totalRefunded: refundTotals.totalRefunded,
        totalRefunds: parseInt(refundTotals.totalRefundCount) || 0,
        uniqueAddresses: parseInt(refundTotals.uniqueRefundAddresses) || 0
    } : {
        totalRefunded: refunds.reduce((sum, refund) => (BigInt(sum) + BigInt(refund.amount)).toString(), '0'),
        totalRefunds: refunds.length,
        uniqueAddresses: new Set(refunds.map(refund => refund.investor.toLowerCase())).size
    };


    // Create summaries from raw refunds data for table display
    const refundSummaries = useMemo(() => {
        const summaryMap = new Map<string, any>();

        refunds.forEach(refund => {
            const address = refund.investor.toLowerCase();
            const existing = summaryMap.get(address);

            if (existing) {
                existing.totalRefunded = (BigInt(existing.totalRefunded) + BigInt(refund.amount)).toString();
                existing.refundCount += 1;
                existing.lastRefunded = Math.max(existing.lastRefunded, parseInt(refund.timestamp));
            } else {
                summaryMap.set(address, {
                    address: refund.investor,
                    totalRefunded: refund.amount,
                    refundCount: 1,
                    lastRefunded: refund.timestamp
                });
            }
        });

        return Array.from(summaryMap.values()).sort((a, b) =>
            BigInt(b.totalRefunded) > BigInt(a.totalRefunded) ? 1 : -1
        );
    }, [refunds]);

    return {
        refunds,
        summaries: refundSummaries,
        totals,
        loading,
        error,
        refetch: fetchData,
        isConnected
    };
}

// Hook for investments
export function useInvestments(): UseInvestmentsReturn {
    const [investments, setInvestments] = useState<any[]>([]);
    const [summaries, setSummaries] = useState<InvestorSummaryData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            // Fetch investments
            const investmentsResponse = await queryGraphQL<{ investments: any[] }>(
                GET_INVESTMENTS,
                {
                    first: 1000,
                    skip: 0,
                    orderBy: 'timestamp',
                    orderDirection: 'desc'
                }
            );

            if (investmentsResponse.errors) {
                throw new Error(investmentsResponse.errors[0].message);
            }

            setInvestments(investmentsResponse.data.investments);
            setIsConnected(true);

            // Fetch investor summaries for investments (limited to 1000 due to Graph Protocol limits)
            const summariesResponse = await queryGraphQL<{ investorSummaries: InvestorSummaryData[] }>(
                GET_INVESTOR_SUMMARIES,
                {
                    first: 1000,
                    skip: 0,
                    orderBy: 'totalInvested',
                    orderDirection: 'desc'
                }
            );

            if (summariesResponse.errors) {
                throw new Error(summariesResponse.errors[0].message);
            }


            setSummaries(summariesResponse.data.investorSummaries);

        } catch (err) {
            console.error('Error fetching investments:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch investments');
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Use aggregate totals from subgraph if available, otherwise calculate from raw data
    const [investmentTotals, setInvestmentTotals] = useState<InvestmentTotalsData | null>(null);

    const fetchInvestmentTotals = useCallback(async () => {
        try {
            const response = await queryGraphQL<{ investmentTotals: InvestmentTotalsData }>(
                GET_INVESTMENT_TOTALS,
                {}
            );

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            setInvestmentTotals(response.data.investmentTotals);
        } catch (err) {
            console.error('Error fetching investment totals:', err);
        }
    }, []);

    useEffect(() => {
        fetchInvestmentTotals();
    }, [fetchInvestmentTotals]);

    const totals = investmentTotals ? {
        totalInvested: investmentTotals.totalInvested,
        totalInvestments: parseInt(investmentTotals.totalInvestmentCount),
        uniqueAddresses: parseInt(investmentTotals.uniqueInvestorAddresses)
    } : {
        totalInvested: summaries.reduce((sum, summary) => (BigInt(sum) + BigInt(summary.totalInvested)).toString(), '0'),
        totalInvestments: summaries.reduce((sum, summary) => sum + Number(summary.investmentCount), 0),
        uniqueAddresses: summaries.length
    };

    return {
        investments,
        summaries,
        totals,
        loading,
        error,
        refetch: fetchData,
        isConnected
    };
}

// Hook for sale status
export function useSaleStatus() {
    const [saleStatus, setSaleStatus] = useState<SaleStatusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            const response = await queryGraphQL<{ saleStatus: SaleStatusData }>(GET_SALE_STATUS);

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            setSaleStatus(response.data.saleStatus);

        } catch (err) {
            console.error('Error fetching sale status:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch sale status');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        saleStatus,
        loading,
        error,
        refetch: fetchData
    };
}

// Hook for user counters
export function useUserCounters() {
    const [userCounters, setUserCounters] = useState<UserCountersData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            const response = await queryGraphQL<{ userCounters: UserCountersData }>(
                GET_USER_COUNTERS,
                {}
            );

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            setUserCounters(response.data.userCounters);

        } catch (err) {
            console.error('Error fetching user counters:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch user counters');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        userCounters,
        loading,
        error,
        refetch: fetchData
    };
}

// Hook for aggregated totals data
export function useAllTotals() {
    const [allTotals, setAllTotals] = useState<AllTotalsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            const response = await queryGraphQL<AllTotalsData>(
                GET_ALL_TOTALS,
                {}
            );

            if (response.errors) {
                throw new Error(response.errors[0].message);
            }

            setAllTotals(response.data);

        } catch (err) {
            console.error('Error fetching all totals:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch all totals');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        allTotals,
        loading,
        error,
        refetch: fetchData
    };
}
