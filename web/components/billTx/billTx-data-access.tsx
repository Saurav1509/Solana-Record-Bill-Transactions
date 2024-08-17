'use client';

import { BILL_TX_PROGRAM_ID, getBillTxProgram, getBillTxProgramId } from '@record-bill-tx/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { useMemo } from 'react';

interface BillTxArgs {
  billRefId: string,
  totalAmount: string,
  items: string[],
  isPaymentDone: boolean
}

export function useBillTxProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const program = getBillTxProgram(provider);

  const programId = useMemo(
    () => getBillTxProgramId(cluster.network as Cluster),
    [cluster]
  )

  const accounts = useQuery({
    queryKey: ['billTx', 'all', {cluster}],
    queryFn: () => program.account.billingState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(BILL_TX_PROGRAM_ID),
  });

  const createBill = useMutation<string, Error, BillTxArgs>({
    mutationKey: ['billTx', 'create', { cluster }],
    mutationFn: async ({billRefId, totalAmount, items, isPaymentDone}) => {
      const [billTxPda] = await PublicKey.findProgramAddressSync(
        [Buffer.from(billRefId), provider.wallet.publicKey.toBuffer()],
        programId
      )

      return program.methods
        .createBill(billRefId, totalAmount, items, isPaymentDone)
        .rpc();
    },
    onSuccess:(signature: string) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: error => toast.error(`Failed to create bill: ${error.message}`),
  });

  return {
    program,
    BILL_TX_PROGRAM_ID,
    getProgramAccount,
    createBill,
    programId,
    accounts,
    provider
  };
}

export function useBillTxProgramAccount({account}: {account: PublicKey}) {
  const {cluster} = useCluster();
  const transactionToast = useTransactionToast();
  const {program, accounts, programId, provider} = useBillTxProgram();

  const accountQuery = useQuery({
    queryKey: ['billTx', 'fetch', {cluster, account}],
    queryFn: () => program.account.billingState.fetch(account),
  });

  const updateBill = useMutation<string, Error, BillTxArgs>({
    mutationKey: ['billTx', 'update', { cluster }],
    mutationFn: async ({billRefId, totalAmount, items, isPaymentDone}) => {
      const [billTxPda] = await PublicKey.findProgramAddressSync(
        [Buffer.from(billRefId), provider.wallet.publicKey.toBuffer()],
        programId
      )

      return program.methods
        .updateBill(billRefId, totalAmount, items, isPaymentDone)
        .rpc();
    },
    onSuccess:(signature: string) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: error => toast.error(`Failed to update bill: ${error.message}`),
  });

  const deleteBill = useMutation<string, Error, BillTxArgs>({
    mutationKey: ['billTx', 'delete', {cluster}],
    mutationFn: async ({billRefId, totalAmount}) => {
      return program.methods
        .deleteBill(billRefId, totalAmount)
        .rpc()
    }
  })

  return {
    updateBill,
    accountQuery,
    deleteBill
  };
}
