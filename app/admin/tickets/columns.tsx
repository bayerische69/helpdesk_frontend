'use client'

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { ArrowUpDown, Clipboard } from "lucide-react"
import axios from '../../config/axios'
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Modal from '../../components/Modal'
import { useState } from "react"

export type Tickets = {
    _id: string,
    userID: string,
    email: string,
    priorityStatus: "Low" | "Medium" | "High" | "Urgent",
    division: "PSD" | "ADMIN" | "SUPPLY" | "RECORDS" | "ARCHIVES"
    category: "Software Issue" | "Hardware Issue",
    scheduleDateTime: Date,
    description: string,
    ticketStatus: "Pending" | "In Progress" | "Closed - Referred to CMISID" | "Closed - Resolved",
}


export const columns: ColumnDef<Tickets>[] = [
    {
        accessorKey: "_id",
        header: "ID",
    },
    {
        accessorKey: "userID.fullName",
        header: "Full Name"
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc" )}
                >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />        
                </Button>
            )
        }
    },
    {
        accessorKey: "priorityStatus",
        header: "Priority Status"
    },
    {
        accessorKey: "division",
        header: "Division"
    },
    {
        accessorKey: "category",
        header: "Category"
    },
    {
    accessorKey: "scheduleDateTime",
    header: "Schedule Date & Time",
    cell: ({ row }) => {
        const value = row.getValue("scheduleDateTime") as string | Date

        if (!value) return "-"

        const date = new Date(value)

        return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        }).format(date)
    },
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorKey: "ticketStatus",
        header: "Status"
    },
    {
        id: "actions",
        cell: ({row}) => {
            const ticket = row.original
            const [isOpen, setIsOpen] = useState(false)
            const [isDeleteOpen, setIsDeleteOpen] = useState(false)
            const [status, setStatus] = useState(ticket?.ticketStatus || "")


            const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()

                try {
                    const res = await axios.put(`/tickets/${ticket._id}`, {
                        ticketStatus: status
                    })
                        if (res.status === 200) {
                            alert("Ticket status updated successfully")
                            setIsOpen(false)
                            window.location.reload()
                        } else {
                            alert("Failed to update ticket status")
                        }
                } catch (error) {
                    console.error("Error updating ticket status:", error)
                }

            }

            const handleDelete = async () => {
                try {
                    const res = await axios.delete(`/tickets/delete/${ticket._id}`)
                    if (res.status === 200) {
                        alert("Ticket deleted successfully")
                        window.location.reload()
                    } else {
                        alert("Failed to delete ticket")
                    }
                } catch (error) {
                    console.error("Error deleting ticket:", error)
                }
            }

            return (
                <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white" >
                        <DropdownMenuItem className="cursor-pointer text-yellow-700 hover:bg-amber-300" onClick={() => setIsOpen(true)}>
                        <Pencil /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-700 hover:bg-red-300" onClick={() => setIsDeleteOpen(true)}>
                        <Trash2 /> Delete
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="cursor-pointer text-blue-700 hover:bg-blue-300" onClick={() => {
                            navigator.clipboard.writeText(ticket._id)
                            alert("Ticket ID copied to clipboard")
                        }}>
                        <Clipboard /> Copy ticket ID
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Ticket Status">
                    <div>
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="flex flex-col mb-3">
                                    <select
                                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setStatus(e.target.value as "Pending" | "In Progress" | "Closed - Referred to CMISID" | "Closed - Resolved")}
                                    >
                                    <option value="" disabled>
                                        Select a Ticket Status
                                    </option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Closed - Referred to CMISID">Closed - Referred to CMISID</option>
                                    <option value="Closed - Resolved">Closed - Resolved</option>
                                    </select>
                            </div>           

                            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                            <Button
                                variant="outline"
                                className="bg-[#BF092F] text-white w-full sm:w-auto cursor-pointer"
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="outline"
                                className="bg-[#4988C4] text-white w-full sm:w-auto cursor-pointer"
                            >
                                Submit
                            </Button>
                            </div>                   
                        </form>
                    </div>
                </Modal>


                <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Ticket">
                    <div>
                        <p>Are you sure you want to delete this ticket?</p>
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                            <Button
                                variant="outline"
                                className="bg-[#BF092F] text-white w-full sm:w-auto cursor-pointer"
                                onClick={() => {
                                    setIsDeleteOpen(false)
                                }}                                
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="outline"
                                className="bg-[#4988C4] text-white w-full sm:w-auto cursor-pointer"
                                onClick={handleDelete}
                            >
                                Submit
                            </Button>
                        </div>                           
                    </div>
                </Modal>
                </div>

            )
        }
    },


]

