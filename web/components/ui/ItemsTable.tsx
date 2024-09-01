import { Dispatch, SetStateAction } from "react";

export function ItemsTable({
    items, 
    itemPrices, 
    setItems,
    setItemPrices,
    setTotalAmount,
    totalAmount}: 
    {
        items: string[], 
        itemPrices:number[], 
        setItems:Dispatch<SetStateAction<string[]>>,
        setItemPrices: Dispatch<SetStateAction<number[]>>,
        setTotalAmount: Dispatch<SetStateAction<string>>,
        totalAmount: string
}) {
    return <div className="overflow-x-auto">
    <table className="table bg-transparent font-bold text-xl">
        <thead>
        <tr className="text-center">
            <th className="text-right"></th>
            <td>Name</td>
            <td>Price</td>
            <th></th>
        </tr>
        </thead>
        <tbody>
        {items.map((item, index) => {
            return(
                <tr key={index} className="text-center">
                    {items[0]!==""?
                        (
                            <>
                                <th className="text-right">{index +1}</th>
                                <td>{item}</td>
                                <td>{itemPrices[index]}</td>
                            </>
                        ):
                            <></>
                    }
                    <th className="flex justify-center">
                        {items[0]!==""?
                            (<button 
                                className="btn btn-xs lg:btn-md btn-primary flex content-around"
                                onClick={() => {
                                setItems(items.filter((_, i) => i !== index));
                                setTotalAmount((Number(totalAmount) - itemPrices[index]).toString())
                                setItemPrices(itemPrices.filter((_, i) => i !== index));
                                }}
                            >x</button>):
                            (<></>)
                        }
                    </th>
                </tr>
            )
        })}
        </tbody>
    </table>
    </div>
}