'use client';

import { useState, useMemo, useEffect } from 'react';
import { formatNumber, weiToUSDC, formatAddress } from '@/lib/utils';
import { ChevronUp, ChevronDown, Search, DollarSign, ExternalLink } from 'lucide-react';

interface InvestmentSummary {
    address: string;
    totalInvested: string;
    investmentCount: number;
    lastInvested: number;
}

interface InvestmentsTableProps {
    summaries: InvestmentSummary[];
    loading: boolean;
}

export function InvestmentsTable({ summaries, loading }: InvestmentsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof InvestmentSummary>('totalInvested');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const filteredAndSortedSummaries = useMemo(() => {
        let filtered = summaries.filter(summary =>
            summary.address.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            let aValue: any = a[sortField];
            let bValue: any = b[sortField];

            if (sortField === 'totalInvested') {
                aValue = BigInt(aValue);
                bValue = BigInt(bValue);
            } else if (sortField === 'lastInvested') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [summaries, searchTerm, sortField, sortDirection]);

    const totalPages = Math.ceil(filteredAndSortedSummaries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSummaries = filteredAndSortedSummaries.slice(startIndex, endIndex);

    const handleSort = (field: keyof InvestmentSummary) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const SortIcon = ({ field }: { field: keyof InvestmentSummary }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="relative overflow-hidden bg-dark-200/40 backdrop-blur-sm rounded-2xl shadow-xl border border-accent-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent-400/20 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                    <div className="p-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 bg-dark-300 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 bg-dark-300 rounded"></div>
                                <div className="h-4 bg-gray-200 bg-dark-300 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 bg-dark-300 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-dark-200/40 backdrop-blur-sm rounded-2xl shadow-xl border border-accent-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent-400/20 to-transparent rounded-full blur-xl"></div>
            <div className="relative z-10">
                <div className="p-4 sm:p-6 border-b border-dark-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-white">
                            Investments by Address
                        </h2>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search addresses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-dark-300/50 border border-dark-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-sm sm:text-base"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-300/20">
                        <thead className="bg-dark-300/30 backdrop-blur-sm">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('address')}
                                >
                                    <div className="flex items-center">
                                        Address
                                        <SortIcon field="address" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('totalInvested')}
                                >
                                    <div className="flex items-center">
                                        Total Invested
                                        <SortIcon field="totalInvested" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('investmentCount')}
                                >
                                    <div className="flex items-center">
                                        Investment Count
                                        <SortIcon field="investmentCount" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('lastInvested')}
                                >
                                    <div className="flex items-center">
                                        Last Invested
                                        <SortIcon field="lastInvested" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-dark-200/30 backdrop-blur-sm divide-y divide-dark-300/20">
                            {paginatedSummaries.map((summary, index) => (
                                <tr key={summary.address} className="hover:bg-dark-300/30">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-white">
                                                {formatAddress(summary.address)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">
                                            {formatNumber(weiToUSDC(summary.totalInvested), 2)} USDC
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">
                                            {summary.investmentCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">
                                            {new Date(Number(summary.lastInvested) * 1000).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a
                                            href={`https://etherscan.io/address/${summary.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-accent-400 bg-accent-500/10 border border-accent-500/20 rounded-lg hover:bg-accent-500/20 hover:text-accent-300 transition-colors duration-200"
                                        >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            View on Etherscan
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-dark-300/20">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedSummaries.length)} of {filteredAndSortedSummaries.length} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm bg-dark-300/50 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-300/70"
                                >
                                    Previous
                                </button>

                                {/* Page numbers */}
                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-1 text-sm rounded ${currentPage === pageNum
                                                    ? 'bg-accent-600 text-white'
                                                    : 'bg-dark-300/50 text-white hover:bg-dark-300/70'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm bg-dark-300/50 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-300/70"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
