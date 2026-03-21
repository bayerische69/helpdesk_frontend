'use client'
import Image from "next/image";
import { Header } from "./components/Header";
import coverimage from './images/coverImage.png'
import coverimage2 from './images/coverimage2.png'
import logo from './images/Logo.png'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Pencil, TicketPlus, Trash2  } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import { DateTimePicker } from "./components/DateTimePicker";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import axios from "./config/axios";

export default function Home() {
  const [open, setOpen] = useState(false);


  const [ticket, setTicket] = useState({
    userID: "",
    email: "",
    priorityStatus: "",
    category: "",
    division: "",
    scheduleDateTime: "",
    description: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ _id: string; fullName: string }[]>([]);
  const [localTickets, setLocalTickets] = useState<{ data: { _id: string; email: string; division: string; category: string; priorityStatus: string; createdAt: string } }[]>([])
  const [ticketID, setTicketId] = useState("")
  const [ticketSearch, setTicketSearch] = useState<{
    _id: string;
    email: string;
    division: string;
    category: string;
    priorityStatus: string;
    createdAt: string;
    description: string;
    scheduleDateTime: string;
    ticketStatus: string;
    userID: { fullName: string };
  } | null>(null)
  const [ticketError, setTicketError] = useState("")

  const [existingSchedules, setExistingSchedules] = useState<string[]>([])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");

    const sortedTickets = [...storedTickets].sort(
      (a: any, b: any) =>
        new Date(b.data.createdAt).getTime() -
        new Date(a.data.createdAt).getTime()
    );


    const schedules = async () => {
      try {
        const res = await axios.get("/tickets/getTicketSchedules");
        // Extract only the ISO strings
        const dates = res.data.map((item: any) => item.scheduleDateTime)

        setExistingSchedules(dates)

      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    }

    schedules();
    setLocalTickets(sortedTickets);
    getUsers();
  }, []);


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    console.log("ticket:",ticket) 

    if (!ticket.userID || !ticket.email || !ticket.priorityStatus || !ticket.category || !ticket.division || !ticket.scheduleDateTime || !ticket.description) {
      setError("All fields are required");
      return;
    }

    
    try{
      const res = await axios.post("/tickets", ticket) 

      const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]")
      storedTickets.push(res.data)
      localStorage.setItem("tickets", JSON.stringify(storedTickets))

      // Reset form
      setTicket({
        userID: "",
        email: "",
        priorityStatus: "",
        category: "",
        division: "",
        scheduleDateTime: "",
        description: "",
      })

      alert("Ticket submitted and saved locally!")
      setOpen(false)
      window.location.reload();

    } catch (error: any) {
      const data = error.response?.data

      // If backend sent response
      if (error.response) {
        const data = error.response.data;

        // If schedule is taken
        if (data.available === false) {
          const slots = data.nextAvailableSchedules
            ?.map((d: string) => new Date(d).toLocaleString())
            .join("\n");

          alert(
            `${data.message}\n\nNext Available Slots:\n${slots}`
          );
          return;
        }

        alert(data.message || "Failed to submit ticket.");
      } else {
        alert("Network error. Please try again.");
      }

    }

  }

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setError("")

    const confirmCancel = window.confirm(
      "Are you sure you want to clear this form? All entered data will be lost."
    )

    if (!confirmCancel) return

    setTicket({
      userID: "",
      email: "",
      priorityStatus: "",
      category: "",
      division: "",
      scheduleDateTime: "",
      description: ""      
    })
  }

  const fetchTicket = async (ticketID: string) => {
    if (!ticketID) return
    // optional but recommended

    if (ticketID.length !== 24) {
      setError("Invalid Ticket ID")
      setTicketSearch(null)
      return
    }

    try {
      setTicketError("")
      const res = await axios.get(`/tickets/${ticketID}`)
      console.log(res.data)
      setTicketSearch(res.data)
    } catch (error) {
      setTicketSearch(null)
      setTicketError(
        (error as any).response?.data?.message || "Ticket not Found"
      )
    }

  }


  return (
    <div className="max-width ">
      <Header />


      <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full mb-5">

        {/* COLUMN 1 */}
        <div
          className="md:col-span-2 bg-no-repeat bg-cover bg-center
                    px-6 py-10 md:px-20 lg:px-60"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(206, 127, 0, 0.4),
                rgba(206, 127, 0, 0.4)
              ),
              url(${coverimage.src})
            `,
          }}
        >
          <div className="welcome text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Image src={logo} alt="CGSO LOGO" />

              <h1 className="text-xl md:text-2xl font-bold">
                Welcome to City General Service Office
                <span className="block">Internal Help Desk</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl mt-6 md:pl-20">
              How can I help you?
            </p>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div
          className="relative bg-no-repeat bg-cover bg-center min-h-[250px]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(206, 127, 0, 0.4),
                rgba(206, 127, 0, 0.4)
              ),
              url(${coverimage2.src})
            `,
          }}
        >
          <div className="absolute bottom-0 w-full p-4 md:p-6">
            <p className="text-sm text-right mb-2 font-medium">
              Track Ticket Status
            </p>

            <Input
              type="text"
              placeholder="Enter your Ticket Number"
              className="bg-white border-[#CE7F00] rounded-2xl h-10"
              value={ticketID}
              onChange={(e) => {
                const value = e.target.value
                setTicketId(value)

                if (value.length === 24) {
                  fetchTicket(value)
                } else {
                  setTicketSearch(null)
                  setTicketError("")
                }
              }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchTicket(ticketID)
              }
            }}              
            />

          </div>
        </div>
      </div>



      <div className="mx-5 md:mx-20">
          
        {ticketError && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {ticketSearch && (
          <div>
            <div className="mb-3">
              <h1 className="font-bold text-lg">
                Ticket Number
                <span className="text-2xl ms-2 text-green-600 font-extrabold">
                  {ticketSearch._id}
                </span>
              </h1>
            </div>

          <Table>
            <TableHeader className="bg-[#2aa8e3]">
              <TableHead className="font-bold">Full Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Description</TableHead>              
              <TableHead className="font-bold">Division</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Priority Status</TableHead> 
              <TableHead className="font-bold">Schedule</TableHead>              
              <TableHead className="font-bold">Created At</TableHead>              
              <TableHead className="font-bold">Ticket Status</TableHead>              
            </TableHeader>
            <TableBody>
              <TableRow className="font-semibold text-red-600">
                <TableCell>{ticketSearch.userID.fullName}</TableCell>
                <TableCell>{ticketSearch.email}</TableCell>
                <TableCell>{ticketSearch.description}</TableCell>
                <TableCell>{ticketSearch.division}</TableCell>
                <TableCell>{ticketSearch.category}</TableCell>
                <TableCell>{ticketSearch.priorityStatus}</TableCell>
                <TableCell>
                      {new Date(ticketSearch.scheduleDateTime).toLocaleString("en-PH", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}                  
                </TableCell>
                         <TableCell>
                      {new Date(ticketSearch.createdAt).toLocaleString("en-PH", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}                  
                </TableCell>
                <TableCell>{ticketSearch.ticketStatus}</TableCell>
                
              </TableRow>
            </TableBody>
          </Table>
          </div>
        )}

        <div className="flex justify-between items-center mb-5 mt-5 ">
          <h1 className="text-2xl font-bold">History</h1>

          <Button className="bg-[#E3B32A] hover:bg-[#d4a51f] text-black w-50 h-10 font-bold cursor-pointer " onClick={() => setOpen(true)}>
            <TicketPlus />
            Submit a Ticket</Button>
        </div>
        <div className=" h-full rounded-md">
          <Table >
            <TableHeader className="bg-[#E3B32A]">
              <TableRow  >
                <TableHead className="font-bold">Ticket No.</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Division</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Created At</TableHead>
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="border-b border-b-[#E3B32A]">
              {localTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                localTickets.map((ticket, index) => (
                  <TableRow key={ticket.data._id ?? index}>
                    <TableCell className="font-medium">{ticket.data._id ?? `T-${index + 1}`}</TableCell>
                    <TableCell>{ticket.data.email}</TableCell>
                    <TableCell>{ticket.data.division}</TableCell>
                    <TableCell>{ticket.data.category}</TableCell>
                    <TableCell>
                      {new Date(ticket.data.createdAt).toLocaleString("en-PH", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell>{ticket.data.priorityStatus}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>                
          </Table>
        </div>
      </div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Submit A Ticket"
      >
      <form className="w-full">

          {error && (
            <p className="text-red-500 text-sm mb-3">
              {error}
            </p>
          )}        
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">User</label>
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ticket.userID}
              onChange={(e) => 
                setTicket({ ...ticket, userID: e.target.value })
              }
            >
              <option value="" disabled>
                Select a user
              </option>

              {users.map((user, index) => (
                <option
                  key={user._id ?? index} // use index if id is missing
                  value={user._id}
                >
                  {user.fullName}
                </option>
              ))}
            </select>

          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="Enter your Email" value={ticket.email} 
            onChange={(e) => 
              setTicket({
                ...ticket, email: e.target.value
              })
            }      
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Priority Status</label>
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ticket.priorityStatus}
              onChange={(e) => {
                setTicket({
                  ...ticket, priorityStatus: e.target.value
                })
              }}
            >
              <option value="" disabled>
                Select a Priority Status
              </option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Category</label>
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ticket.category}
              onChange={(e) => {
                setTicket({
                  ...ticket, category: e.target.value
                })
              }}
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Software Issue">Software Issue</option>
              <option value="Hardware Issue">Hardware Issue</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Division</label>
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ticket.division}
              onChange={(e) => {
                setTicket({
                  ...ticket, division: e.target.value
                })
              }}
            >
              <option value="" disabled>
                Select a Division
              </option>
              <option value="PSD">PSD</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPPLY">SUPPLY</option>
              <option value="RECORDS">RECORDS</option>
              <option value="ARCHIVES">ARCHIVES</option>
            </select>
          </div>

          <div className="flex flex-col">
            {/* <DateTimePicker
              onChange={(d) =>
                existingSchedules={existingSchedules}
                setTicket({
                  ...ticket,
                  scheduleDateTime: d.toLocaleString("en-PH", {
                    timeZone: "Asia/Manila"
                  })
                })
              }
            />         */}
<DateTimePicker
  existingSchedules={existingSchedules}
  onChange={(d) =>
    setTicket({
      ...ticket,
      scheduleDateTime: d.toISOString(),
    })
  }
/>

          </div>
        </div>

        {/* Description */}
        <div className="w-full mb-4">
          <Label htmlFor="message">Description</Label>
          <Textarea
            placeholder="Enter details here"
            id="message"
            className="mt-1"
            value={ticket.description}
            onChange={(e) => 
              setTicket({
                ...ticket, description: e.target.value
              })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            className="bg-[#BF092F] text-white w-full sm:w-auto cursor-pointer"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            className="bg-[#4988C4] text-white w-full sm:w-auto cursor-pointer"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </form>

      </Modal>
    </div>
  );
}

