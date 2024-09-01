import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import QRCodeStyling from "qr-code-styling"
import { PublicKey } from "@solana/web3.js"
import { paymentURL } from "@/solana-pay/paymentUrl"
import { IconQrcode } from "@tabler/icons-react"
import { validate } from '@/solana-pay/validate';
import { useBillTxProgram, useBillTxProgramAccount } from "../billTx/billTx-data-access"
import { useTransactionToast } from '../ui/ui-layout';

export function QRCode({billRefId, totalAmount, account, owner}: {billRefId: string, totalAmount: string, account: PublicKey, owner: PublicKey}) {

  const [paymentUrl, setPaymentUrl] = useState("")
  const [qrToggle, setQrToggle] = useState(false)
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const [reference, setReference] = useState<PublicKey>();
  const ref = useRef(null);
  const [status, setStatus] = useState("")
  const [time, setTime] = useState("0")
  const transactionToast = useTransactionToast();

  const timeToWaitForPayment = 300 // in seconds

  const {
    accountQuery,
    updateBill
  } = useBillTxProgramAccount({ account });

  useEffect(() => {
    const fetchQRCodeData = async () => {
      const { qrCode, url, reference } = await getQRDetails(billRefId, totalAmount, owner);
      setQrCode(qrCode)
      setPaymentUrl(url.toString())
      setReference(reference)
    };
    fetchQRCodeData();
  }, [billRefId, totalAmount]);

  useEffect(() => {
      if(ref.current && qrToggle) {
        try {
          qrCode?.append(ref.current);
          qrCode?.update({ data: paymentUrl });
        } catch (error) {
          console.error("Error displaying QR code:", error);
        }
      }
  }, [qrToggle, paymentUrl]);

  useEffect(() => {
      qrCode?.update({
        data: paymentUrl
      });
  }, [paymentUrl]);

  const startTime = () => {
    const interval = setInterval(() => {
      console.log(time)
      setTime((prevTime) => {
        if(Number(prevTime) >= timeToWaitForPayment) {
          clearInterval(interval);
          setTime("0")
          // @ts-expect-error error of ts for daisy ui
          document?.getElementById('qr_code_modal')?.close();
          return prevTime;
        }
        console.log(prevTime)
        return (Number(prevTime)+5).toString();
      })
    }, 2000)
  }
  

  return <div>
    {/* <div ref={ref}></div>
      <button className="btn btn-xs lg:btn-md btn-outline" onClick={() => {
          setQrToggle(!qrToggle);
        }}>
        {qrToggle?(
          <>Hide QR</>
          ):(
          <>Show QR</>
          )}
      </button>
      <button className="btn btn-xs lg:btn-md btn-outline" onClick={async () => {
            try {
              const {paymentStatus, signature} = await validate(reference!, totalAmount, accountQuery.data!.owner)
              setStatus(paymentStatus);
              transactionToast(signature);
              // @ts-expect-error error of ts for daisy ui
              document?.getElementById('qr_code_modal')?.close();
              if(paymentStatus === 'validated') {
                updateBill.mutateAsync({billRefId, totalAmount, items: accountQuery.data!.items, isPaymentDone: true})
              }
            }catch(e) {
              console.log(e)
              // @ts-expect-error error of ts for daisy ui
              document?.getElementById('qr_code_modal')?.close();
            }
      }}>check payment status</button> */}
      {status=='validated'?(
          <>✅ payment done</>
        ):(
          <></>
        )}
        <div>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button className="btn btn-xs lg:btn-md btn-outline" onClick={async ()=>{
            {/* @ts-expect-error daisy ui modal impl need to ignore ts for it */}
            document?.getElementById('qr_code_modal')?.showModal();
            setTime("0")
            setQrToggle(!qrToggle);
            await startTime();
            try {
              const {paymentStatus, signature} = await validate(reference!, totalAmount, accountQuery.data!.owner)
              setStatus(paymentStatus);
              transactionToast(signature);
              // @ts-expect-error error of ts for daisy ui
              document?.getElementById('qr_code_modal')?.close();
              if(paymentStatus === 'validated') {
                updateBill.mutateAsync({billRefId, totalAmount, items: accountQuery.data!.items, isPaymentDone: true})
              }
            }catch(e) {
              console.log(e)
              // @ts-expect-error error of ts for daisy ui
              document?.getElementById('qr_code_modal')?.close();
            }
          }}>open modal</button>
          <dialog id="qr_code_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">QR Code for Payment</h3>
              <p className="py-4">Scan below QR to pay before {timeToWaitForPayment/60} mins</p>
              <progress className="progress progress-primary w-56" value={time} max={timeToWaitForPayment.toString()}></progress>
              <div ref={ref}></div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
  </div>
}

async function getQRDetails(billRefId:string, totalAmount:string, owner:PublicKey) {
  const {qrCode, url, reference} = await paymentURL(billRefId, Number(totalAmount), owner);

  return {qrCode, url, reference}
}