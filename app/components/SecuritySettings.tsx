"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from '../config/axios'

const SecuritySettings = () => {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await axios.put(
        "/admin/password/update", // adjust your route
        {
          currentPassword,
          newPassword,
          confirmPassword
        },
        {
          withCredentials: true // ✅ VERY IMPORTANT (sends cookie)
        }
      )

      if (res.data.success) {
        alert("Password updated successfully")

        // clear fields
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        alert(res.data.message)
      }

    } catch (error: any) {
      console.error(error)
      alert(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }


  return (
<div>
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      <form onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="flex flex-col mb-3 relative w-[520px]">
          <label className="text-sm font-medium mb-2">
            Current Password
          </label>

          <Input
            type={showCurrent ? "text" : "password"}
            placeholder="Enter Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-9"
          >
            {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* New Password */}
        <div className="flex flex-col mb-3 relative w-[520px]">
          <label className="text-sm font-medium mb-2">
            New Password
          </label>

          <Input
            type={showNew ? "text" : "password"}
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-9"
          >
            {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col mb-3 relative w-[520px]">
          <label className="text-sm font-medium mb-2">
            Confirm Password
          </label>

          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-9"
          >
            {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 w-[520px]">
          <Button
            type="button"
            className="bg-[#BF092F] text-white"
            onClick={() => {
              setCurrentPassword("")
              setNewPassword("")
              setConfirmPassword("")
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#4988C4] text-white"
          >
            {loading ? "Updating..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SecuritySettings
