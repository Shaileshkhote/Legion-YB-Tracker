#!/bin/bash

# Deploy script for Legion Token Tracker Subgraph

echo "🚀 Deploying Legion Token Tracker Subgraph..."

# Check if Graph CLI is installed
if ! command -v graph &> /dev/null; then
    echo "❌ Graph CLI not found. Installing..."
    npm install -g @graphprotocol/graph-cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate code
echo "🔧 Generating code..."
npm run codegen

# Build subgraph
echo "🏗️ Building subgraph..."
npm run build

# Deploy to The Graph hosted service
echo "🚀 Deploying to The Graph hosted service..."
echo "Make sure you have:"
echo "1. Created a subgraph on https://thegraph.com/hosted-service/"
echo "2. Updated the subgraph name in package.json"
echo "3. Set up authentication with 'graph auth'"
echo ""
read -p "Press Enter to continue with deployment..."

npm run deploy

echo "✅ Subgraph deployed successfully!"
echo "🔗 View your subgraph at: https://thegraph.com/hosted-service/subgraph/your-username/legion-token-tracker"
echo ""
echo "📝 Next steps:"
echo "1. Update GRAPH_ENDPOINT in lib/graphql.ts with your subgraph URL"
echo "2. Update the frontend to use the new GraphQL hooks"
echo "3. Test the integration"
