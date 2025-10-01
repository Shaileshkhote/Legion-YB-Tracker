'use client';

import { useState } from 'react';
import { useTokenClaims, useRefunds, useInvestments, useUserCounters, useAllTotals } from '@/hooks/useGraphQL';
import { DashboardCharts } from '@/components/DashboardCharts';
import { ClaimsTable } from '@/components/ClaimsTable';
import { RefundsTable } from '@/components/RefundsTable';
import { InvestmentsTable } from '@/components/InvestmentsTable';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AlertCircle, DollarSign, RefreshCw } from 'lucide-react';

type Tab = 'claims' | 'refunds' | 'investments';

export default function Home() {
    const [activeTab, setActiveTab] = useState<Tab>('refunds');

    const claimsData = useTokenClaims();
    const refundsData = useRefunds();
    const investmentsData = useInvestments();
    const userCountersData = useUserCounters();
    const allTotalsData = useAllTotals();

    const handleRefresh = () => {
        if (activeTab === 'claims') {
            claimsData.refetch();
        } else if (activeTab === 'refunds') {
            refundsData.refetch();
        } else if (activeTab === 'investments') {
            investmentsData.refetch();
        }
        // Always refresh user counters and all totals
        userCountersData.refetch();
        allTotalsData.refetch();
    };

    const getCurrentData = () => {
        switch (activeTab) {
            case 'claims':
                return {
                    loading: claimsData.loading,
                    error: claimsData.error,
                    isConnected: claimsData.isConnected,
                    hasData: claimsData.summaries.length > 0
                };
            case 'refunds':
                return {
                    loading: refundsData.loading,
                    error: refundsData.error,
                    isConnected: refundsData.isConnected,
                    hasData: refundsData.summaries.length > 0
                };
            case 'investments':
                return {
                    loading: investmentsData.loading,
                    error: investmentsData.error,
                    isConnected: investmentsData.isConnected,
                    hasData: investmentsData.summaries.length > 0
                };
            default:
                return {
                    loading: false,
                    error: null,
                    isConnected: false,
                    hasData: false
                };
        }
    };

    const currentData = getCurrentData();

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-black flex flex-col">
                {/* Navigation */}
                <Navigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onRefresh={handleRefresh}
                    loading={currentData.loading}
                    isConnected={currentData.isConnected}
                />

                {/* Main Content */}
                <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-transparent w-full">
                    {/* Contract Info */}
                    <div className="mb-8">
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Contract Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Contract Address:</span>
                                    <a
                                        href="https://etherscan.io/address/0x28be6260dbb7872de5effc9a4a73c85b7405a8c0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-teal-400 hover:text-teal-300 font-mono"
                                    >
                                        0x28be6260dbb7872de5effc9a4a73c85b7405a8c0
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-400">Network:</span>
                                    <span className="ml-2 text-white">Ethereum Mainnet</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error State */}
                    {currentData.error && (
                        <div className="mb-8">
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                                    <div>
                                        <h3 className="text-sm font-medium text-red-200">
                                            Error loading data
                                        </h3>
                                        <p className="text-sm text-red-300 mt-1">
                                            {currentData.error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dashboard Charts - Always visible */}
                    <DashboardCharts
                        claimsData={allTotalsData.allTotals?.claimTotals && allTotalsData.allTotals.claimTotals !== null ? {
                            totalClaimed: allTotalsData.allTotals.claimTotals.totalClaimed,
                            totalClaims: parseInt(allTotalsData.allTotals.claimTotals.totalClaimCount),
                            uniqueAddresses: parseInt(allTotalsData.allTotals.claimTotals.uniqueClaimerAddresses)
                        } : claimsData.totals}
                        refundsData={allTotalsData.allTotals?.refundTotals && allTotalsData.allTotals.refundTotals !== null ? {
                            totalRefunded: allTotalsData.allTotals.refundTotals.totalRefunded,
                            totalRefunds: parseInt(allTotalsData.allTotals.refundTotals.totalRefundCount),
                            uniqueAddresses: parseInt(allTotalsData.allTotals.refundTotals.uniqueRefundAddresses)
                        } : refundsData.totals}
                        investmentsData={allTotalsData.allTotals?.investmentTotals && allTotalsData.allTotals.investmentTotals !== null ? {
                            totalInvested: allTotalsData.allTotals.investmentTotals.totalInvested,
                            totalInvestments: parseInt(allTotalsData.allTotals.investmentTotals.totalInvestmentCount),
                            uniqueAddresses: parseInt(allTotalsData.allTotals.investmentTotals.uniqueInvestorAddresses)
                        } : investmentsData.totals}
                        userCounters={allTotalsData.allTotals?.userCounters && allTotalsData.allTotals.userCounters !== null ? {
                            totalInvestmentUsers: parseInt(allTotalsData.allTotals.userCounters.totalInvestmentUsers),
                            totalRefundUsers: parseInt(allTotalsData.allTotals.userCounters.totalRefundUsers),
                            totalClaimUsers: parseInt(allTotalsData.allTotals.userCounters.totalClaimUsers)
                        } : {
                            totalInvestmentUsers: userCountersData.userCounters ? parseInt(userCountersData.userCounters.totalInvestmentUsers) : 0,
                            totalRefundUsers: userCountersData.userCounters ? parseInt(userCountersData.userCounters.totalRefundUsers) : 0,
                            totalClaimUsers: userCountersData.userCounters ? parseInt(userCountersData.userCounters.totalClaimUsers) : 0
                        }}
                        loading={currentData.loading || allTotalsData.loading}
                    />

                    {/* Data Display */}
                    {!currentData.loading && !currentData.error && (
                        <>
                            {/* Claims Tab */}
                            {activeTab === 'claims' && (
                                <div className="mt-8">
                                    <ClaimsTable
                                        summaries={claimsData.summaries.map(summary => ({
                                            address: summary.address,
                                            totalClaimed: summary.totalClaimed,
                                            claimCount: summary.claimCount,
                                            lastClaimed: summary.lastClaimed ? parseInt(summary.lastClaimed) : 0
                                        }))}
                                        loading={claimsData.loading}
                                    />
                                </div>
                            )}

                            {/* Refunds Tab */}
                            {activeTab === 'refunds' && (
                                <div className="mt-8">
                                    <RefundsTable
                                        summaries={refundsData.summaries.map(summary => ({
                                            address: summary.address,
                                            totalRefunded: summary.totalRefunded,
                                            refundCount: summary.refundCount,
                                            lastRefunded: summary.lastRefunded ? parseInt(summary.lastRefunded) : 0
                                        }))}
                                        loading={refundsData.loading}
                                    />
                                </div>
                            )}

                            {/* Investments Tab */}
                            {activeTab === 'investments' && (
                                <div className="mt-8">
                                    <InvestmentsTable
                                        summaries={investmentsData.summaries.map(summary => ({
                                            address: summary.address,
                                            totalInvested: summary.totalInvested,
                                            investmentCount: summary.investmentCount,
                                            lastInvested: summary.lastInvested ? parseInt(summary.lastInvested) : 0
                                        }))}
                                        loading={investmentsData.loading}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </ErrorBoundary>
    );
}