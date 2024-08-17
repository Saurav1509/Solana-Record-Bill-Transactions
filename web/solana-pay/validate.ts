import { findReference, FindReferenceError, validateTransfer } from "@solana/pay"
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import BigNumber from 'bignumber.js';

export async function validate( reference: PublicKey, totalAmount:string, owner: PublicKey) {
    console.log("finding the transaction")

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const recipient = new PublicKey(owner)

    let signatureInfo;
    let paymentStatus;

    paymentStatus = 'pending'

    //@ts-ignore
    const { signature } = await new Promise((resolve, reject) => {
        /**
         * Retry until we find the transaction
         *
         * If a transaction with the given reference can't be found, the `findTransactionSignature`
         * function will throw an error. There are a few reasons why this could be a false negative:
         *
         * - Transaction is not yet confirmed
         * - Customer is yet to approve/complete the transaction
         *
         * You can implement a polling strategy to query for the transaction periodically.
         */
        const interval = setInterval(async () => {
            console.count('Checking for transaction...');
            try {
                signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
                console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                clearInterval(interval);
                resolve(signatureInfo);
            } catch (error: any) {
                if (!(error instanceof FindReferenceError)) {
                    console.error(error);
                    clearInterval(interval);
                    reject(error);
                }
            }
        }, 10000);
    });
    
    paymentStatus = 'confirmed';

    console.log('\n6. 🔗 Validate transaction \n');

    const bigTotalAmount = new BigNumber(totalAmount)

    try {
        await validateTransfer(connection, signature, { recipient: recipient, amount: bigTotalAmount });

        // Update payment status
        paymentStatus = 'validated';
        console.log('✅ Payment validated');
    } catch (error) {
        console.error('❌ Payment failed', error);
    }

    return {
        paymentStatus,
    }

}