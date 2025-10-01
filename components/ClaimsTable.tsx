'use client';

import { useState, useMemo } from 'react';
import { ClaimSummary } from '@/lib/contract';
import { formatAddress, formatNumber, weiToEther, formatDate } from '@/lib/utils';
import { Search, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

interface ClaimsTableProps {
    summaries: ClaimSummary[];
    loading: boolean;
}

type SortField = 'totalClaimed' | 'claimCount' | 'lastClaimed';
type SortDirection = 'asc' | 'desc';

export function ClaimsTable({ summaries, loading }: ClaimsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('totalClaimed');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const filteredAndSortedSummaries = useMemo(() => {
        let filtered = summaries.filter(summary =>
            summary.address.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'totalClaimed':
                    const aBigInt = BigInt(a.totalClaimed);
                    const bBigInt = BigInt(b.totalClaimed);
                    comparison = aBigInt > bBigInt ? 1 : aBigInt < bBigInt ? -1 : 0;
                    break;
                case 'claimCount':
                    comparison = a.claimCount - b.claimCount;
                    break;
                case 'lastClaimed':
                    comparison = a.lastClaimed - b.lastClaimed;
                    break;
                default:
                    return 0;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [summaries, searchTerm, sortField, sortDirection]);

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
            <div className="relative overflow-hidden bg-dark-200/40 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-xl"></div>
                <div className="relative z-10">
                    <div className="p-6">
                        <div className="animate-pulse">
                            <div className="h-4 bg-dark-400 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 bg-dark-400 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-dark-200/40 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-xl"></div>
            <div className="relative z-10">
                <div className="p-4 sm:p-6 border-b border-dark-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-white">
                            Token Claims by Address
                        </h2>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search addresses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-dark-400 rounded-lg bg-dark-400 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm sm:text-base"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-dark-300/30 backdrop-blur-sm">
                            <tr>
                                <th
                                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('totalClaimed')}
                                >
                                    <div className="flex items-center gap-1">
                                        Address
                                        <SortIcon field="totalClaimed" />
                                    </div>
                                </th>
                                <th
                                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('totalClaimed')}
                                >
                                    <div className="flex items-center gap-1">
                                        <span className="hidden sm:inline">Total Claimed</span>
                                        <span className="sm:hidden">Total</span>
                                        <SortIcon field="totalClaimed" />
                                    </div>
                                </th>
                                <th
                                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('claimCount')}
                                >
                                    <div className="flex items-center gap-1">
                                        Claims
                                        <SortIcon field="claimCount" />
                                    </div>
                                </th>
                                <th
                                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-dark-400"
                                    onClick={() => handleSort('lastClaimed')}
                                >
                                    <div className="flex items-center gap-1">
                                        <span className="hidden sm:inline">Last Claimed</span>
                                        <span className="sm:hidden">Last</span>
                                        <SortIcon field="lastClaimed" />
                                    </div>
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-dark-200/30 backdrop-blur-sm divide-y divide-dark-300/20">
                            {filteredAndSortedSummaries.map((summary, index) => (
                                <tr key={summary.address} className="hover:bg-dark-300/30">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-xs sm:text-sm font-medium text-white">
                                                {formatAddress(summary.address)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        <div className="text-xs sm:text-sm text-white">
                                            <span className="hidden sm:inline">{formatNumber(weiToEther(summary.totalClaimed), 4)} YieldBasis</span>
                                            <span className="sm:hidden">{formatNumber(weiToEther(summary.totalClaimed), 2)} YB</span>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium bg-primary-900/20 text-primary-300">
                                            {summary.claimCount}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400">
                                        <span className="hidden sm:inline">{summary.lastClaimed > 0 ? formatDate(summary.lastClaimed) : 'N/A'}</span>
                                        <span className="sm:hidden">{summary.lastClaimed > 0 ? new Date(summary.lastClaimed * 1000).toLocaleDateString() : 'N/A'}</span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                        <a
                                            href={`https://etherscan.io/address/${summary.address}#internaltx`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20 rounded-lg hover:bg-teal-500/20 hover:text-teal-300 transition-colors duration-200"
                                        >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            <span className="hidden sm:inline">View on Etherscan</span>
                                            <span className="sm:hidden">View</span>
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
                            {searchTerm ? 'No addresses found matching your search.' : 'No token claims found.'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
