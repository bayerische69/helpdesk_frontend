import React from 'react'
import AdminHeader from '@/app/components/adminHeader'
import { Button } from '@/components/ui/button'
import SettingsTabs from '@/app/components/SettingsTabs'

const settings = () => {
  return (
    <div className='w-full'>
        <AdminHeader />

        <div className="mx-23  my-10">

            <SettingsTabs />


        </div>
    </div>
  )
}

export default settings
