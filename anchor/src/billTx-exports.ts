// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import type { BillTx } from '../target/types/bill_tx';
import bill_txIDL from '../target/idl/bill_tx.json';

// Re-export the generated IDL and type
export { BillTx, bill_txIDL };

// The programId is imported from the program IDL.
export const BILL_TX_PROGRAM_ID = new PublicKey(bill_txIDL.address);

// This is a helper function to get the Basic Anchor program.
export function getBillTxProgram(provider: AnchorProvider) {
  return new Program(bill_txIDL as BillTx, provider);
}

export function getBillTxProgramId(cluster: Cluster) {
  switch(cluster) {
    case 'devnet':
    case 'testnet':
      return new PublicKey('HRqUrh12DaapFSP1sT7ezuTsFNfVqDqKfTCd6mmBsYqN');
    case 'mainnet-beta': 
    default: 
      return BILL_TX_PROGRAM_ID;
  }
}
