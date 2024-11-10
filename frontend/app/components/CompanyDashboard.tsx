"use client"

import { useState } from "react"
import { LineChart, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CompanyDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null)

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
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-900 font-semibold">
              Dashboard
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="ghost" className="text-gray-500">
              Marketplace
            </Button>
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/placeholder-user.jpg"
              alt="Kevin Dukkon"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium">Kevin Dukkon</p>
              <p className="text-gray-500">kevin@athledger.io</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Hello, Kevin</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <LineChart className="h-5 w-5 inline mr-2" />
                Amount Spent
              </CardTitle>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">From last 7 days</SelectItem>
                  <SelectItem value="30d">From last 30 days</SelectItem>
                  <SelectItem value="90d">From last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-100 text-gray-500">
                Amount Spent Chart Placeholder
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
                    <Button size="sm" onClick={() => handleCompletePayment("Stripe Inc.")}>
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
                          <DialogTitle>Athlete Data: {selectedAthlete}</DialogTitle>
                          <DialogDescription>Asian Games Jump Performance Data</DialogDescription>
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