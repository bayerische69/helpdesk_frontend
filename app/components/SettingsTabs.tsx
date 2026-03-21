'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import UsersTable from './UsersTable'
import SecuritySettings from './SecuritySettings'

const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'security'>('users')

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className={activeTab === 'users' ? 'bg-green-500 text-white cursor-pointer' : 'cursor-pointer'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </Button>

        <Button
          variant="outline"
          className={activeTab === 'security' ? 'bg-green-500 text-white cursor-pointer' : 'cursor-pointer'}
          onClick={() => setActiveTab('security')}
        >
          Security
        </Button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'users' && <UsersTable />}
        {activeTab === 'security' && <SecuritySettings />}
      </div>
    </div>
  )
}

export default SettingsTabs
