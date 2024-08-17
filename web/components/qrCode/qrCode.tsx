import { useEffect, useRef, useState } from "react"
import QRCodeStyling from "qr-code-styling"
import { PublicKey } from "@solana/web3.js"
import { paymentURL } from "@/solana-pay/paymentUrl"
import { IconQrcode } from "@tabler/icons-react"
import { validate } from '@/solana-pay/validate';
import { useBillTxProgram, useBillTxProgramAccount } from "../billTx/billTx-data-access"

export function QRCode({billRefId, totalAmount, account, owner}: {billRefId: string, totalAmount: string, account: PublicKey, owner: PublicKey}) {

  const [paymentUrl, setPaymentUrl] = useState("")
  const [qrToggle, setQrToggle] = useState(false)
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const [reference, setReference] = useState<PublicKey>();
  const ref = useRef(null);
  const [status, setStatus] = useState("")

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

  return <div>
    <div ref={ref}></div>
      <button onClick={() => {
          setQrToggle(!qrToggle);
        }}>
        {qrToggle?<>Hide QR</>:<>Show QR</>}
      </button>
      <button onClick={async () => {
            const {paymentStatus} = await validate(reference!, totalAmount, accountQuery.data!.owner)
            setStatus(paymentStatus);
            if(paymentStatus === 'validated') {
              updateBill.mutateAsync({billRefId, totalAmount, items: accountQuery.data!.items, isPaymentDone: true})
            }
      }}>check payment status</button>
      {status=='validated'?<>✅ payment done</>: <>payment pending</>}
  </div>
}

async function getQRDetails(billRefId:string, totalAmount:string, owner:PublicKey) {
  const {qrCode, url, reference} = await paymentURL(billRefId, Number(totalAmount), owner);

  return {qrCode, url, reference}
}