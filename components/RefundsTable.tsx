'use client';

import { useState, useMemo, useEffect } from 'react';
import { RefundSummary } from '@/lib/contract';
import { formatAddress, formatNumber, weiToUSDC, formatDate } from '@/lib/utils';
import { Search, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

interface RefundsTableProps {
    summaries: RefundSummary[];
    loading: boolean;
}

type SortField = 'totalRefunded' | 'refundCount' | 'lastRefunded';
type SortDirection = 'asc' | 'desc';

export function RefundsTable({ summaries, loading }: RefundsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('totalRefunded');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);


    const filteredAndSortedSummaries = useMemo(() => {
        let filtered = summaries.filter(summary =>
            summary.address.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'totalRefunded':
                    const aBigInt = BigInt(a.totalRefunded);
                    const bBigInt = BigInt(b.totalRefunded);
                    comparison = aBigInt > bBigInt ? 1 : aBigInt < bBigInt ? -1 : 0;
                    break;
                case 'refundCount':
                    comparison = a.refundCount - b.refundCount;
                    break;
                case 'lastRefunded':
                    comparison = a.lastRefunded - b.lastRefunded;
                    break;
                default:
                    return 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [summaries, searchTerm, sortField, sortDirection]);

    // Pagination logic
    const totalPages = Math.ceil(filteredAndSortedSummaries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSummaries = filteredAndSortedSummaries.slice(startIndex, endIndex);

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />;
    };

    if (loading) {
        return (
            <div className="relative overflow-hidden bg-dark-200/40 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                    <div className="p-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 bg-dark-300 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 bg-dark-300 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-dark-200/40 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
            <div className="relative z-10">
                <div className="p-6 border-b border-dark-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-xl font-semibold text-white">
                            Refunds by Address
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search addresses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-dark-400 rounded-lg bg-dark-300 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-300/30 backdrop-blur-sm">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('totalRefunded')}
                                >
                                    <div className="flex items-center gap-1">
                                        Address
                                        <SortIcon field="totalRefunded" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('totalRefunded')}
                                >
                                    <div className="flex items-center gap-1">
                                        Total Refunded
                                        <SortIcon field="totalRefunded" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('refundCount')}
                                >
                                    <div className="flex items-center gap-1">
                                        Refunds
                                        <SortIcon field="refundCount" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('lastRefunded')}
                                >
                                    <div className="flex items-center gap-1">
                                        Last Refunded
                                        <SortIcon field="lastRefunded" />
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
                                            {formatNumber(weiToUSDC(summary.totalRefunded), 4)} USDC
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">
                                            {summary.refundCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {summary.lastRefunded > 0 ? formatDate(summary.lastRefunded) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a
                                            href={`https://etherscan.io/address/${summary.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 hover:text-blue-300 transition-colors duration-200"
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

                {filteredAndSortedSummaries.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-gray-400">
                            {searchTerm ? 'No addresses found matching your search.' : 'No refunds found.'}
                        </div>
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredAndSortedSummaries.length > 0 && (
                    <div className="px-6 py-4 border-t border-dark-300/20">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedSummaries.length)} of {filteredAndSortedSummaries.length} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-400 bg-dark-300/50 rounded-lg hover:bg-dark-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                                                    ? 'bg-teal-600 text-white'
                                                    : 'text-gray-400 bg-dark-300/50 hover:bg-dark-400/50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-400 bg-dark-300/50 rounded-lg hover:bg-dark-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
