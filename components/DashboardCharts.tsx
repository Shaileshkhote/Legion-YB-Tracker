'use client';

import { formatNumber, weiToEther, weiToUSDC } from '@/lib/utils';
import { TrendingUp, DollarSign, Users, Activity, Coins, RefreshCw } from 'lucide-react';

interface DashboardChartsProps {
    claimsData: {
        totalClaimed: string;
        totalClaims: number;
        uniqueAddresses: number;
    };
    refundsData: {
        totalRefunded: string;
        totalRefunds: number;
        uniqueAddresses: number;
    };
    investmentsData: {
        totalInvested: string;
        totalInvestments: number;
        uniqueAddresses: number;
    };
    userCounters: {
        totalInvestmentUsers: number;
        totalRefundUsers: number;
        totalClaimUsers: number;
    };
    loading: boolean;
}

export function DashboardCharts({ claimsData, refundsData, investmentsData, userCounters, loading }: DashboardChartsProps) {


    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                    <p className="text-gray-600 text-gray-400">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    const totalClaimedFormatted = formatNumber(weiToEther(claimsData.totalClaimed), 2);
    const totalRefundedFormatted = formatNumber(weiToUSDC(refundsData.totalRefunded), 2);

    return (
        <div className="space-y-8">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Total Claims Chart */}
                <div className="relative overflow-hidden rounded-2xl bg-dark-200/80 backdrop-blur-sm border border-emerald-500/30 p-4 sm:p-6 text-white shadow-xl shadow-emerald-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-transparent"></div>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-lg sm:text-2xl font-bold text-white">{totalClaimedFormatted}</div>
                                <div className="text-emerald-100 text-xs sm:text-sm">YieldBasis</div>
                            </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <div className="text-emerald-100 text-xs sm:text-sm">Total Tokens Claimed</div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-emerald-200">Claims: {claimsData.totalClaims.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Refunds Chart */}
                <div className="relative overflow-hidden rounded-2xl bg-dark-200/80 backdrop-blur-sm border border-rose-500/30 p-4 sm:p-6 text-white shadow-xl shadow-rose-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/15 via-transparent to-transparent"></div>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-rose-400/30 to-transparent rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-lg sm:text-2xl font-bold text-white">{totalRefundedFormatted}</div>
                                <div className="text-rose-100 text-xs sm:text-sm">USDC</div>
                            </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <div className="text-rose-100 text-xs sm:text-sm">Total Refunded</div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-rose-200">Refunds: {refundsData.totalRefunds.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Investments Card */}
                <div className="relative overflow-hidden rounded-2xl bg-dark-200/80 backdrop-blur-sm border border-blue-500/30 p-4 sm:p-6 text-white shadow-xl shadow-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-transparent"></div>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-lg sm:text-2xl font-bold text-white">{formatNumber(weiToUSDC(investmentsData.totalInvested), 2)}</div>
                                <div className="text-blue-100 text-xs sm:text-sm">USDC Invested</div>
                            </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <div className="text-blue-100 text-xs sm:text-sm">Investment Activity</div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-blue-200">Total Users: {investmentsData.totalInvestments.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Participants Card */}
                <div className="relative overflow-hidden rounded-2xl bg-dark-200/80 backdrop-blur-sm border border-purple-500/30 p-4 sm:p-6 text-white shadow-xl shadow-purple-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-transparent to-transparent"></div>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-transparent rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-right">
                                <div className="text-lg sm:text-2xl font-bold text-white">{Math.max(investmentsData.totalInvestments).toLocaleString()}</div>
                                <div className="text-purple-100 text-xs sm:text-sm">Total Participants</div>
                            </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <div className="text-purple-100 text-xs sm:text-sm">Unique Users</div>
                            <div className="grid grid-cols-1 gap-1 text-xs sm:text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-purple-200">Investors: {investmentsData.totalInvestments.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
}
