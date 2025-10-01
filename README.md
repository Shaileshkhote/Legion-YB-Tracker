# Legion Token Tracker

A sleek, modern interface to track `TokenAllocationClaimed` events from the Legion.cc sale contract on Ethereum mainnet.

## Features

- 🔍 **Real-time Event Tracking**: Monitors all token allocation claims from the contract
- 📊 **Comprehensive Statistics**: Shows total claimed tokens, vested amounts, and participant counts
- 🔎 **Address Search**: Search and filter by wallet addresses
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🌙 **Dark Mode**: Built-in dark/light theme support
- ⚡ **Fast Performance**: Optimized for quick data loading and smooth interactions

## Contract Information

- **Contract Address**: `0x28be6260dbb7872de5effc9a4a73c85b7405a8c0`
- **Network**: Ethereum Mainnet
- **Event Tracked**: `TokenAllocationClaimed`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How It Works

The application connects to Ethereum mainnet using a public RPC endpoint and:

1. **Fetches Contract Events**: Queries all `TokenAllocationClaimed` events from the contract
2. **Processes Data**: Aggregates claims by address and calculates statistics
3. **Displays Results**: Shows a comprehensive table with search and sorting capabilities

## Data Displayed

For each address that has claimed tokens, the interface shows:

- **Address**: Ethereum wallet address (with Etherscan link)
- **Total Claimed**: Amount of tokens claimed immediately
- **Total Vested**: Amount of tokens locked for vesting
- **Claim Count**: Number of individual claim transactions
- **Last Claimed**: Timestamp of the most recent claim

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Ethereum**: Ethers.js v6
- **Icons**: Lucide React

## Configuration

The application uses a public RPC endpoint by default. For better reliability and rate limits, you can configure your own RPC provider by modifying the `useTokenClaims` hook.

## Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- Contract interaction failures
- Data processing errors
- User interface errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects!

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
# Legion-YB-Tracker
