import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { BillTx } from '../target/types/bill_tx';

describe('basic', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider)

  const program = anchor.workspace.BillTx as Program<BillTx>;

  const bill = {
    billRefId: "1",
    totalAmount: "123",
    items: ["item1", "item2", "item3"],
    isPaymentDone: true
  }

  const [billPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(bill.billRefId), provider.wallet.publicKey.toBuffer()],
    program.programId,
  )

  it('Created a new Bill', async () => {
    // Add your test here.
    const tx = await program.methods
      .createBill(bill.billRefId, bill.totalAmount, bill.items, bill.isPaymentDone)
      .rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.billingState.fetch(billPda);
    expect(bill.billRefId === account.billRefId);
    expect(bill.totalAmount === account.totalAmount);
    expect(bill.items === account.items);
    expect(bill.isPaymentDone === account.isPaymentDone);
  });

  it('Updated the Bill', async () => {
    // Add your test here.

    const newBill = {
      totalAmount: "124",
      items: ["updatedItem1", "updatedItem2"],
      isPaymentDone: false
    }

    const tx = await program.methods
      .updateBill(bill.billRefId, newBill.totalAmount, newBill.items, newBill.isPaymentDone)
      .rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.billingState.fetch(billPda);
    expect(newBill.totalAmount === account.totalAmount);
    expect(newBill.items === account.items);
    expect(newBill.isPaymentDone === account.isPaymentDone);
  });

  it('Deleted the Bill', async () => {
    // Add your test here.

    const tx = await program.methods
      .deleteBill(bill.billRefId, bill.totalAmount)
      .rpc();
    console.log('Your transaction signature', tx);

  });
});
