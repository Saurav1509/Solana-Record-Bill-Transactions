export function ViewOnlyItemsTable({items}: {items: string[]|undefined}) {
    return <div className="overflow-x-auto">
    <table className="table font-bold text-xl">
      {/* head */}
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {/* row 1 */}
        {items?.map((item,index)=> {
            return (
                <tr key={index}>
                    <th>{index+1}</th>
                    <td>{item}</td>
                </tr>
            )
        })}
      </tbody>
    </table>
  </div>
}