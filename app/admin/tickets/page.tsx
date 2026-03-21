import AdminHeader from '@/app/components/adminHeader'
import { columns, Tickets } from './columns'
import { DataTable } from './data-table'
import axios from '../../config/axios'



async function getData(): Promise<Tickets[]> {
  try {
    const {data} = await axios.get<Tickets[]>('/tickets')
    return data;
  } catch (error) {
    console.log('Error fetching tickets data:', error)
    return [];
  }
}


export default async function tickets() {
  const data = await getData()
  
  return (
    <div>
      <AdminHeader/>

      <div className="mx-20 my-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

