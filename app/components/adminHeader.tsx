"use client"

import React, { useState } from 'react'
import logo from "../images/Logo.png"
import Image from 'next/image'
import { Bell, Settings, LayoutDashboard, Ticket, Menu, X, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import axios from '../config/axios'

const AdminHeader = () => {

  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [showMobileNotif, setShowMobileNotif] = useState(false)

  const handleLogout = async () => {

    try {
      await axios.post(
        "/admin/logout",
        {},
        { withCredentials: true } // 👈 VERY important
      );

      router.push("/admin");
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }


  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={16} />,
      color: "bg-[#135898]"
    },
    {
      name: "Manage Ticket",
      path: "/admin/tickets",
      icon: <Ticket size={16} />,
      color: "bg-[#1E9B3B]"
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={16} />,
      color: "bg-gray-600"
    }
  ]

  return (
    <div className="w-full bg-[#FBD311]">
      <div className="flex justify-between items-center h-12 lg:mx-20 px-4">

        {/* Logo */}
        <div className='flex items-center gap-2'>
          <Image src={logo} alt="Logo" width={35} />
          <h1 className="text-[#135898] font-bold text-xs sm:text-sm">
            CITY GENERAL SERVICES OFFICE - INTERNAL HELPDESK
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">

          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`
                flex items-center gap-1 text-white px-3 py-1 rounded-md text-sm cursor-pointer
                ${item.color}
                ${pathname === item.path ? "ring-2 ring-amber-700" : ""}
              `}
            >
              {item.icon}
              {item.name}
            </button>
          ))}

        {/* Notification */}
        {/* <div className="relative mt-2">

          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative cursor-pointer"
          >
            <Bell className="text-red-600" />

            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">

              <h3 className="text-sm font-semibold mb-2">
                Notifications
              </h3>

              <div className="space-y-2">

                <div className="text-xs bg-gray-100 p-2 rounded">
                  📌 New ticket assigned
                </div>

                <div className="text-xs bg-gray-100 p-2 rounded">
                  ✅ Ticket #102 resolved
                </div>

                <div className="text-xs bg-gray-100 p-2 rounded">
                  ⚠ System update scheduled
                </div>

              </div>

              <button
                onClick={() => {
                  router.push("/admin/notifications")
                  setShowNotif(false)
                }}
                className="w-full mt-3 text-xs text-blue-600 hover:underline"
              >
                View all notifications
              </button>

            </div>
          )}
        </div> */}

          <div className="relative mt-2">
            <button
              className="relative cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="text-black-600 font-bold" />

            </button>            
          </div>


        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#FBD311] px-4 pb-3 space-y-2">

          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path)
                setIsOpen(false)
              }}
              className={`
                w-full flex items-center gap-2 text-white px-3 py-2 rounded-md text-sm
                ${item.color}
                ${pathname === item.path ? "ring-2 ring-white" : ""}
              `}
            >
              {item.icon}
              {item.name}
            </button>
          ))}

          {/* Mobile Notification */}
          <div className="space-y-2">

            <button
              onClick={() => setShowMobileNotif(!showMobileNotif)}
              className="w-full flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md text-sm"
            >
              <Bell size={16} />
              Notifications (3)
            </button>

            {showMobileNotif && (
              <div className="bg-white rounded-lg p-3 space-y-2 text-xs">

                <div className="bg-gray-100 p-2 rounded">
                  📌 New ticket assigned
                </div>

                <div className="bg-gray-100 p-2 rounded">
                  ✅ Ticket #102 resolved
                </div>

                <div className="bg-gray-100 p-2 rounded">
                  ⚠ System update scheduled
                </div>

                <button
                  onClick={() => {
                    router.push("/admin/notifications")
                    setIsOpen(false)
                  }}
                  className="w-full text-blue-600 text-xs mt-2 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default AdminHeader
