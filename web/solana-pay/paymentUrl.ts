import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import {encodeURL, createQR} from '@solana/pay'
import BigNumber from 'bignumber.js';

export async function paymentURL(billRefId: string, totalAmount:number, owner: PublicKey) {
    let paymentStatus: string;

    console.log('Establish connection to the network');
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    console.log('Simulate a customer checkout \n');
    const recipient = new PublicKey(owner)
    const amount = new BigNumber(totalAmount);
    const reference = new Keypair().publicKey;
    const label = 'Restaurant';
    const message = `Restaurant bill payment for order id: ${billRefId}`;
    const memo = `${billRefId}`

    console.log('Creating payment request link \n');
    const url = encodeURL({recipient, amount, reference, label, message, memo});

    const qrCode = createQR(url);

    return {
        qrCode,
        url,
        reference
    }
}