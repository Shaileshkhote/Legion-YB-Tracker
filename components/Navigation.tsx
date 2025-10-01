'use client';

import { useState } from 'react';
import { Coins, RefreshCw, Wifi, WifiOff, DollarSign, Menu, X } from 'lucide-react';

interface NavigationProps {
    activeTab: 'claims' | 'refunds' | 'investments';
    onTabChange: (tab: 'claims' | 'refunds' | 'investments') => void;
    onRefresh: () => void;
    loading: boolean;
    isConnected: boolean;
}

// Dashboard SVG Logo Component
const DashboardLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="url(#gradient)" />
        <rect x="6" y="6" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
        <rect x="18" y="6" width="8" height="8" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="6" y="18" width="8" height="8" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="18" y="18" width="8" height="8" rx="2" fill="white" fillOpacity="0.5" />
        <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#14b8a6" />
                <stop offset="1" stopColor="#0d9488" />
            </linearGradient>
        </defs>
    </svg>
);

export function Navigation({ activeTab, onTabChange, onRefresh, loading, isConnected }: NavigationProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleTabChange = (tab: 'claims' | 'refunds' | 'investments') => {
        onTabChange(tab);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="relative overflow-hidden bg-dark-200/80 backdrop-blur-sm shadow-xl border-b border-dark-300/50">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-transparent rounded-full blur-xl"></div>
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Header */}
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4 sm:space-x-8">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <DashboardLogo />
                                <span className="text-white font-semibold text-base sm:text-lg">Dashboard</span>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center space-x-4">
                                <button
                                    onClick={() => onTabChange('claims')}
                                    className={`relative overflow-hidden flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'claims'
                                        ? 'bg-dark-200/40 backdrop-blur-sm shadow-xl border border-teal-500/30 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-200/30 hover:backdrop-blur-sm'
                                        }`}
                                >
                                    {activeTab === 'claims' && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent"></div>
                                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-xl"></div>
                                        </>
                                    )}
                                    <Coins className="w-4 h-4 relative z-10" />
                                    <span className="relative z-10">Claims</span>
                                </button>
                                <button
                                    onClick={() => onTabChange('refunds')}
                                    className={`relative overflow-hidden flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'refunds'
                                        ? 'bg-dark-200/40 backdrop-blur-sm shadow-xl border border-blue-500/30 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-200/30 hover:backdrop-blur-sm'
                                        }`}
                                >
                                    {activeTab === 'refunds' && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent"></div>
                                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                                        </>
                                    )}
                                    <RefreshCw className="w-4 h-4 relative z-10" />
                                    <span className="relative z-10">Refunds</span>
                                </button>
                                <button
                                    onClick={() => onTabChange('investments')}
                                    className={`relative overflow-hidden flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'investments'
                                        ? 'bg-dark-200/40 backdrop-blur-sm shadow-xl border border-accent-500/30 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-200/30 hover:backdrop-blur-sm'
                                        }`}
                                >
                                    {activeTab === 'investments' && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent"></div>
                                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-accent-400/20 to-transparent rounded-full blur-xl"></div>
                                        </>
                                    )}
                                    <DollarSign className="w-4 h-4 relative z-10" />
                                    <span className="relative z-10">Investments</span>
                                </button>
                            </nav>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Connection Status - Hidden on very small screens */}
                            <div className="hidden sm:flex items-center">
                                {isConnected ? (
                                    <div className="flex items-center text-teal-400">
                                        <Wifi className="w-4 h-4 mr-1" />
                                        <span className="text-sm">Connected</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-400">
                                        <WifiOff className="w-4 h-4 mr-1" />
                                        <span className="text-sm">Disconnected</span>
                                    </div>
                                )}
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={onRefresh}
                                disabled={loading}
                                className="btn-primary flex items-center text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
                            >
                                <RefreshCw className={`w-4 h-4 mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-dark-300/50 py-4">
                            <nav className="flex flex-col space-y-2">
                                <button
                                    onClick={() => handleTabChange('claims')}
                                    className={`relative overflow-hidden flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'claims'
                                        ? 'bg-dark-200/40 backdrop-blur-sm shadow-xl border border-teal-500/30 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-200/30 hover:backdrop-blur-sm'
                                        }`}
                                >
                                    {activeTab === 'claims' && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent"></div>
                                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-xl"></div>
                                        </>
                                    )}
                                    <Coins className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10 text-base">Claims</span>
                                </button>
                                <button
                                    onClick={() => handleTabChange('refunds')}
                                    className={`relative overflow-hidden flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'refunds'
                                        ? 'bg-dark-200/40 backdrop-blur-sm shadow-xl border border-blue-500/30 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-200/30 hover:backdrop-blur-sm'
                                        }`}
                                >
                                    {activeTab === 'refunds' && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent"></div>
                                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
                                        </>
                                    )}
                                    <RefreshCw className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10 text-base">Refunds</span>
                                </button>
                                <button
                                    onClick={() => handleTabChange('investments')}
                                    className={`relative overflow-hidden flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'investments'
                                        ? 'bg-dark-200/40 backdrop-blur-sm shadow-xl border border-accent-500/30 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-dark-200/30 hover:backdrop-blur-sm'
                                        }`}
                                >
                                    {activeTab === 'investments' && (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-transparent"></div>
                                            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-accent-400/20 to-transparent rounded-full blur-xl"></div>
                                        </>
                                    )}
                                    <DollarSign className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10 text-base">Investments</span>
                                </button>
                            </nav>

                            {/* Mobile Connection Status */}
                            <div className="mt-4 pt-4 border-t border-dark-300/30">
                                <div className="flex items-center justify-center">
                                    {isConnected ? (
                                        <div className="flex items-center text-teal-400">
                                            <Wifi className="w-4 h-4 mr-2" />
                                            <span className="text-sm">Connected to Subgraph</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-400">
                                            <WifiOff className="w-4 h-4 mr-2" />
                                            <span className="text-sm">Disconnected from Subgraph</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
