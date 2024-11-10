'use client'

import { useState, useRef } from 'react'
import { ArrowRight, ChevronDown, Plus, Share } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser, UserButton } from '@clerk/nextjs'

import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Checkbox } from '../../components/ui/checkbox'
import { Switch } from '../../components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog'

// Sample data for the metrics
const metrics = [
  { label: 'Average Heart Rate', value: '70 rpm', change: '+0.3%' },
  { label: 'Longest Jump', value: '23 m', change: '+0.1%' },
  { label: 'Running Speed', value: '18 mph', change: '+0.7%' },
  { label: 'Olympics 2024 Speed', value: '17 mph', change: '+1.5%' },
  { label: 'Sprint Duration', value: '45 s', change: '+0.5%' },
  { label: 'Recovery Time', value: '2 min', change: '+0.2%' },
  { label: 'Peak Performance', value: '95%', change: '+1.0%' },
  { label: 'Endurance Level', value: '8.5/10', change: '+0.4%' },
]

// Sample data for the table
const tableData = [
  {
    customer: { name: 'Stripe Inc.', logo: 'S' },
    dataShared: 'Highest Jump',
    date: '31 May, 2023',
    status: 'Pending',
    amount: '$7,104.24',
  },
  {
    customer: { name: 'Square Cash', logo: '□' },
    dataShared: 'Asian Games Jump',
    date: '28 May, 2023',
    status: 'Completed',
    amount: '$4,245.19',
  },
  {
    customer: { name: 'Stripe Inc.', logo: 'S' },
    dataShared: 'Olympics Record',
    date: '22 May, 2023',
    status: 'Initiated',
    amount: '$1,210.90',
  },
  {
    customer: { name: 'Shopify Inc.', logo: 'S' },
    dataShared: 'Longest run time',
    date: '21 May, 2023',
    status: 'Completed',
    amount: '$2,398.15',
  },
  {
    customer: { name: 'Annalena Klein', logo: 'A' },
    dataShared: 'Highest Jump',
    date: '20 May, 2023',
    status: 'Initiated',
    amount: '$1,600.00',
  },
]

export default function AthleteDashboard() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [privateMetrics, setPrivateMetrics] = useState<string[]>([])
  const [tableRows, setTableRows] = useState(tableData)
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleMetricPrivacy = (metricLabel: string) => {
    setPrivateMetrics(current =>
      current.includes(metricLabel)
        ? current.filter(label => label !== metricLabel)
        : [...current, metricLabel]
    )
  }

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Here you would typically process the CSV file
      console.log('CSV file uploaded:', file.name)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRevoke = (index: number) => {
    setTableRows(current =>
      current.map((row, i) =>
        i === index ? { ...row, status: 'Revoked' } : row
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Tabs defaultValue="dashboard" className="mr-auto">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="ml-auto flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Data</DialogTitle>
                  <DialogDescription>
                    Enter the details to share your performance data
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Enter username" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dataName">Data Name</Label>
                    <Input id="dataName" placeholder="Enter data name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (ETH)</Label>
                    <Input id="amount" placeholder="Enter amount in ETH" type="number" step="0.01" />
                  </div>
                </div>
                <Button className="w-full">Share Data</Button>
              </DialogContent>
            </Dialog>
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
        </div>
      </header>
      <main className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {user?.firstName || user?.username}
          </h1>
        </div>
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full justify-start md:w-auto"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload a CSV file
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Recurring Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <Image
                  src="/placeholder.svg"
                  alt="Revenue Graph"
                  width={600}
                  height={200}
                  className="h-full w-full"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div>Email</div>
                  <div>From last 7 days</div>
                </div>
              </div>
              <Link href="#" className="text-blue-600 hover:underline flex items-center">
                More analysis
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Image
                  src="/placeholder.svg"
                  alt="Performance Heatmap"
                  width={300}
                  height={300}
                  className="mx-auto"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold">23 min</div>
                  <div className="text-xs text-muted-foreground">Breadth Hold</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">2m</div>
                  <div className="text-xs text-muted-foreground">Best Dive</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">123s</div>
                  <div className="text-xs text-muted-foreground">Fastest Lap</div>
                </div>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedMetrics.includes(metric.label)}
                        onCheckedChange={(checked) => {
                          setSelectedMetrics(checked
                            ? [...selectedMetrics, metric.label]
                            : selectedMetrics.filter((m) => m !== metric.label)
                          )
                        }}
                      />
                      <div>
                        <div className="font-medium">{metric.value}</div>
                        <div className="text-sm text-muted-foreground">{metric.label}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={privateMetrics.includes(metric.label)}
                        onCheckedChange={() => toggleMetricPrivacy(metric.label)}
                      />
                      <span className="text-sm font-medium">
                        {privateMetrics.includes(metric.label) ? 'Private' : 'Public'}
                      </span>
                      <span className="text-green-600">{metric.change}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Data Shared</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                          {row.customer.logo}
                        </div>
                        <span>{row.customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{row.dataShared}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          row.status === 'Completed'
                            ? 'bg-green-50 text-green-700'
                            : row.status === 'Pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : row.status === 'Revoked'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Revoke
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently revoke access to the shared data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRevoke(index)}>
                              Confirm Revoke
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}