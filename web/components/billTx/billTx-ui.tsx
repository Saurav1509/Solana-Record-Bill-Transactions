'use client';

import { PublicKey } from '@solana/web3.js';
import { useBillTxProgram, useBillTxProgramAccount } from './billTx-data-access';
import { ChangeEvent, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { ellipsify } from '../ui/ui-layout';
import { paymentURL } from '../../solana-pay/paymentUrl';
import { QRCode } from '../qrCode/qrCode';
import { ItemsTable } from '../ui/ItemsTable';
import { SearchBar } from '../ui/searchBar';
import { ViewOnlyItemsTable } from '../ui/ViewOnlyItemsTable';

export function BillTxCreate() {
  const { createBill } = useBillTxProgram();
  const [billRefId, setBillRefId] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [item, setItem] = useState("");
  const [items, setItems] = useState([""]);
  const [itemPrice, setItemPrice] = useState(0)
  const [itemPrices, setItemPrices] = useState([0]);
  const [isPaymentDone, setIsPaymentDone] = useState(false);

  const handleBillRefIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBillRefId(e.target.value);
  }

  const handleItemChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItem(e.target.value)
  }

  const handleItemPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setItemPrice(value)
  }

  const handleAddItem = () => {
    if(items[0] == "") {
      setItems(previous => [...previous, item])
      setItemPrices(previous => [...previous, itemPrice])
      items.shift();
      itemPrices.shift();

      setTotalAmount((Number(totalAmount) + itemPrice).toString())
      console.log(`total amount is ${totalAmount}`)
      setItem("")
      setItemPrice(0)
    }else {
      setItems(previous => [...previous, item])
      setItemPrices(previous => [...previous, itemPrice])

      setTotalAmount((Number(totalAmount) + itemPrice).toString())
      console.log(`total amount is ${totalAmount}`)
      setItem("")
      setItemPrice(0)
    }
  }
  

  return (
    <div className='p-3 flex flex-col'>
      <div className='justify-center flex-row'>
      <input className='input input-bordered w-full max-w-xs' placeholder='enter billRefId' onChange={handleBillRefIdChange} />
      
      <div className='flex flex-row justify-center'>
        <input className='input input-bordered w-full max-w-xs m-5' 
          placeholder='enter items' 
          value={item}
          onChange={handleItemChange} 
        />
        <div className='flex'>
          <div className='flex-col justify-center pt-6 text-lg'>$</div>
          <input className='input input-bordered input-primary w-full max-w-xs m-5' 
            placeholder='enter items price' 
            type='number'
            value={itemPrice}
            onChange={handleItemPriceChange} />
          </div>
        <button
        className="btn btn-xs lg:btn-md btn-primary m-5"
        onClick={handleAddItem}
        >add item</button>
      </div>
      {/* {items.map((item, index) => {
        return (
          <ol key={index} className='flex justify-around p-1'>
            {items[0]!==""?
              (<li>{item}, {itemPrices[index]}</li>):
                <></>}
            {items[0]!==""?
              (<button 
                className="btn btn-xs lg:btn-md btn-primary flex content-around"
                onClick={() => {
                  setItems(items.filter((_, i) => i !== index));
                }}
              >x</button>):
              (<></>)
            }
          </ol>
        )
      })} */}
      <ItemsTable items={items} itemPrices={itemPrices} setItems={setItems} setItemPrices={setItemPrices} setTotalAmount={setTotalAmount} totalAmount={totalAmount} />
      <div className="stats flex mb-5 bg-transparent">
        <div className="stat">
          <div className="stat-title">Total Bill Amount</div>
          <div className="stat-value text-primary">RS. {totalAmount}</div>
        </div>
      </div>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={() => createBill.mutateAsync({billRefId, totalAmount, items, isPaymentDone})}
        disabled={createBill.isPending}
      >
        Create Bill{createBill.isPending && '...'}
      </button>
      </div>
    </div>
  );
}

export function BillTxList() {
  const { accounts, getProgramAccount } = useBillTxProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <BillTxCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
            // <></>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

async function BillTxCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
    updateBill,
    deleteBill
  } = useBillTxProgramAccount({ account });
  // console.log(accountQuery.data?.owner)

  const {publicKey} = useWallet();
  const [totalAmount, setTotalAmount] = useState("");
  const [items, setItems] = useState(accountQuery.data?.items || [])
  const isPaymentDone = accountQuery.data?.isPaymentDone || false;

  const isFormValid = totalAmount.trim() !== "";
  

  const billRefId = accountQuery.data?.billRefId || "#123";

  const handleSubmit = () => {
    if(publicKey && isFormValid && billRefId) {
      updateBill.mutateAsync({billRefId, totalAmount, items, isPaymentDone})
    }
  }

  // const handleItemsDelete = (index: number) => {
  //   setItems(items.filter((_, i) => i !== index));
  //   console.log(accountQuery.data?.items)
  // };

  
  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer font-bold text-primary"
            onClick={() => accountQuery.refetch()}
          >
            <p>Bill Id: {accountQuery.data?.billRefId}</p>
          </h2>
          <div className='flex justify-around'>
            <p className='flex font-bold text-primary'>Total Amount:</p>
            <p className='font-bold'>${accountQuery.data?.totalAmount}</p>
          </div>
          <ViewOnlyItemsTable items={accountQuery.data?.items}/>
          <p className='font-bold text-accent'>Payment Status: {accountQuery.data?.isPaymentDone?<>✅ Payment Done</>:<>Pending</>}</p>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            {isPaymentDone?(
              <></>
              ):(
                <QRCode billRefId={accountQuery.data!.billRefId} totalAmount={(Number(accountQuery.data!.totalAmount)/10000).toString()} account= {account} owner={accountQuery.data!.owner}/>
              )}
            
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    'Are you sure you want to close this Bil account?'
                  )
                ) {
                  return;
                }
                const billRefId = accountQuery.data?.billRefId;
                if(billRefId){
                  return deleteBill.mutateAsync({billRefId, totalAmount, items, isPaymentDone});
                }
                
              }}
              disabled={deleteBill.isPending}
            >
              Delete this Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}