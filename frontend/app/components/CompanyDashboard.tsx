'use client'

'use client'

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LineChart as LineChartIcon } from "lucide-react"
import { 
  LineChart as RechartsLineChart,
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserButton, useUser } from "@clerk/nextjs"

const spendingData = [
  { date: 'Jan 1', amount: 4500 },
  { date: 'Jan 8', amount: 5200 },
  { date: 'Jan 15', amount: 4800 },
  { date: 'Jan 22', amount: 6100 },
  { date: 'Jan 29', amount: 5700 },
  { date: 'Feb 5', amount: 6500 },
  { date: 'Feb 12', amount: 7200 },
];

export default function CompanyDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null)
  const { user } = useUser()

  const handleViewData = (athlete: string) => {
    setSelectedAthlete(athlete)
  }

  const handleCompletePayment = (athlete: string) => {
    console.log("Complete payment for", athlete)
    // Implement payment logic here
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white p-4 shadow-sm">
        <nav className="flex space-x-4">
          <Link href="/company" passHref>
            <Button variant="ghost" className="text-gray-900 font-semibold">
              Dashboard
            </Button>
          </Link>
          <Link href="/marketplace" passHref>
            <Button variant="ghost" className="text-gray-500">
              Marketplace
            </Button>
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UserButton afterSignOutUrl="/" />
            <div className="text-sm">
              <div className="font-medium">{user?.firstName || user?.username}</div>
              <div className="text-muted-foreground">
                {user?.emailAddresses[0].emailAddress}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Hello, Kevin</h1>

        <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                <LineChartIcon className="h-5 w-5 inline mr-2" />
                Amount Spent
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTimeRange}
                  onValueChange={setSelectedTimeRange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">From last 7 days</SelectItem>
                    <SelectItem value="30d">From last 30 days</SelectItem>
                    <SelectItem value="90d">From last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-green-600 font-medium">+15.3%</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={spendingData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold">$40,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Period</p>
                  <p className="text-2xl font-bold">$7,200</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-medium">Key Data Insights</span>
                <Button variant="link" className="text-blue-600 p-0">
                  More analysis <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Athletes Data Owned</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Requests</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Data Cost</span>
                <span className="font-semibold">$3,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Most Valuable Dataset</span>
                <span className="font-semibold">Olympics 2024 Speed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Athlete Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Athlete Name</TableHead>
                  <TableHead>Data Shared</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <span>Stripe Inc.</span>
                    </div>
                  </TableCell>
                  <TableCell>Highest Jump</TableCell>
                  <TableCell>31 May, 2023</TableCell>
                  <TableCell>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </TableCell>
                  <TableCell>$7,104.24</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleCompletePayment("Stripe Inc.")}
                    >
                      Complete Payment
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <span>Square Cash</span>
                    </div>
                  </TableCell>
                  <TableCell>Asian Games Jump</TableCell>
                  <TableCell>28 May, 2023</TableCell>
                  <TableCell>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </TableCell>
                  <TableCell>$4,245.19</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewData("Square Cash")}
                        >
                          View Data
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Athlete Data: {selectedAthlete}
                          </DialogTitle>
                          <DialogDescription>
                            Asian Games Jump Performance Data
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 items-center gap-4">
                            <span className="font-medium">Jump Height:</span>
                            <span>2.35 meters</span>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <span className="font-medium">Wind Speed:</span>
                            <span>0.4 m/s</span>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <span className="font-medium">Approach Speed:</span>
                            <span>8.2 m/s</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}