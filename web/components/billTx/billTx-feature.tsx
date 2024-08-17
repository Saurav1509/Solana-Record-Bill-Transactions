'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { useBillTxProgram } from './billTx-data-access';
import { BillTxCreate, BillTxList } from './billTx-ui';

export default function BillTxFeature() {
  const { publicKey } = useWallet();
  const { programId } = useBillTxProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Bill Transactions"
        subtitle={'Run the program by clicking the "Run program" button.'}
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <BillTxCreate />
      </AppHero>
      <BillTxList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
