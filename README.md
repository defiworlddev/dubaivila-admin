# Contract Interactor

A React application for interacting with smart contracts, similar to Etherscan's contract interaction interface.

## Features

- **MetaMask Integration**: Connect your MetaMask wallet to interact with contracts
- **ABI Upload**: Upload ABI JSON files or paste ABI directly
- **Contract Address Input**: Enter any contract address to interact with
- **Read Functions**: View-only functions that don't require transactions
- **Write Functions**: Functions that modify contract state (require wallet connection)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Usage

1. **Connect MetaMask**: Click the "Connect MetaMask" button in the header
2. **Enter Contract Address**: Paste the contract address you want to interact with
3. **Load ABI**: Either upload a JSON file containing the ABI or paste it directly
4. **Interact**: Use the Read and Write function sections to interact with the contract

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Wagmi (for MetaMask integration)
- Ethers.js v6
- Viem

## Project Structure

```
src/
  components/        # React components
  context/          # React Context for state management
  service/          # Business logic and utilities
  App.tsx           # Main application component
  main.tsx          # Application entry point
```

