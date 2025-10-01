import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from 'ethers'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format numbers with commas
export function formatNumber(num: string | number, decimals: number = 2): string {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(numValue)) return '0';

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numValue);
}

// Format address for display
export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format date for display
export function formatDate(timestamp: number): string {
    if (!timestamp || timestamp === 0) return 'N/A';

    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Convert wei to ether (for ETH - 18 decimals)
export function weiToEther(wei: string | bigint): string {
    try {
        if (!wei) return '0';
        const value = typeof wei === 'string' ? BigInt(wei) : wei;
        if (value === BigInt(0)) return '0';
        return ethers.formatEther(value);
    } catch (error) {
        console.error('Error converting wei to ether:', wei, error);
        return '0';
    }
}

// Convert wei to USDC (6 decimals)
export function weiToUSDC(wei: string | bigint): string {
    try {
        if (!wei) return '0';
        const value = typeof wei === 'string' ? BigInt(wei) : wei;
        if (value === BigInt(0)) return '0';
        // USDC has 6 decimals, so divide by 10^6
        const usdcValue = Number(value) / Math.pow(10, 6);
        return usdcValue.toString();
    } catch (error) {
        console.error('Error converting wei to USDC:', wei, error);
        return '0';
    }
}