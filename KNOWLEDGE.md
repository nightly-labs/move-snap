# Movement Network Snap Knowledge Base

## Overview

The Movement Network Snap extends MetaMask functionality by enabling direct interaction with Movement networks through your MetaMask wallet. It provides secure key management, transaction signing, and seamless dApp integrations across all Movement networks.

## Key Features

- Multi-network support (Mainnet, Testnet, Devnet)
- Network persistence (remembers last used network)
- Single address management
- Transaction and message signing
- dApp integration
- Secure key management

## Network Management

### Supported Networks

The Snap supports all Movement networks:

- Mainnet
- Testnet
- Devnet
- Custom networks

### Network Features

- Switch between networks using changeNetwork method
- Check current network using getNetwork method
- Network preference is automatically saved
- Setting is maintained after browser restarts

## Account System

### Single Address Model

- One Movement address per Snap installation
- Address is deterministically derived
- Same address is used across all networks
- Non-custodial (private keys never leave the Snap)

### Address Generation

The address is generated using:

- BIP-44 compliant derivation
- Movement's official derivation path
- Secured by MetaMask's architecture

## Transaction Capabilities

### Support for All Movement Transactions

The Snap can sign any Movement-compatible transaction type:

- Entry Functions
- Script Payloads
- Multi-sig Transactions

### Message Signing

Support for:

- Arbitrary message signing

## Support & Resources

### Official Channels

- Discord: https://discord.gg/Kkqq8nahcG
- Twitter: https://x.com/Nightly_app
- Website: https://nightly.app/

## Updates & Maintenance

The Snap is regularly updated with:

- Security improvements
- New features
- Bug fixes
- Network updates
