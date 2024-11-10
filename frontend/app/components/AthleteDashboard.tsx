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

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Sample data for the metrics
const metrics = [
  { label: 'Average Heart Rate', value: '70 rpm', change: '+0.3%', changeType: 'neutral' },
  { label: 'Longest Jump', value: '23 m', change: '+0.1%', changeType: 'neutral' },
  { label: 'Running Speed', value: '18 mph', change: '+0.7%', changeType: 'positive' },
  { label: 'Olympics 2024 Speed', value: '17 mph', change: '+1.5%', changeType: 'neutral' },
  { label: 'Sprint Duration', value: '45 s', change: '+0.5%', changeType: 'neutral' },
  { label: 'Recovery Time', value: '2 min', change: '+0.2%', changeType: 'positive' },
  { label: 'Peak Performance', value: '95%', change: '+1.0%', changeType: 'positive' },
  { label: 'Endurance Level', value: '8.5/10', change: '+0.4%', changeType: 'neutral' },
]

const bestStats = [
  { value: '23 min', label: 'Breadth Hold' },
  { value: '2m', label: 'Best Dive' },
  { value: '123s', label: 'Fastest Lap' },
]

const revenueData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 5200 },
  { month: 'Apr', revenue: 6800 },
  { month: 'May', revenue: 7400 },
  { month: 'Jun', revenue: 7000 },
  { month: 'Jul', revenue: 8200 },
];

const HexagonalHeatmap = () => {
  const generateHexagons = () => {
    const hexagons = []
    const colors = ['#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155']
    const centerX = 250
    const centerY = 150  // Adjusted centerY
    const size = 15      // Reduced size
    const rows = 7
    const cols = 8

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = centerX + (col * size * 1.7) + (row % 2 ? size * 0.85 : 0) - (cols * size * 0.85)
        const y = centerY + (row * size * 1.5) - (rows * size * 0.75)
        const colorIndex = Math.floor(Math.random() * colors.length)
        const opacity = Math.random() * 0.5 + 0.5

        hexagons.push(
          <path
            key={`${row}-${col}`}
            d={`M ${x} ${y} l ${size * 0.866} ${size * 0.5} l 0 ${size} l ${-size * 0.866} ${size * 0.5} l ${-size * 0.866} ${-size * 0.5} l 0 ${-size} z`}
            fill={colors[colorIndex]}
            opacity={opacity}
          />
        )
      }
    }
    return hexagons
  }

  return (
    <svg viewBox="0 0 500 300" className="w-full h-full"> {/* Reduced height */}
      <defs>
        <radialGradient id="heatmapGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: '#F59E0B', stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.4 }} />
        </radialGradient>
      </defs>
      {generateHexagons()}
    </svg>
  )
}

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

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-amber-100'
      default:
        return 'bg-violet-100'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b mb-2">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="ml-auto flex items-center space-x-4">
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
        <div className="flex gap-2 mb-2">
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
        </div>
        <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit"> {/* Add h-fit to make card fit content */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold flex items-center">
              <span className="mr-2">$</span>
              Recurring Revenue
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600 font-medium">+12.3%</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-4"> {/* Reduce bottom padding */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis 
                    dataKey="month" 
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
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">$45,231.89</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Month</p>
                <p className="text-2xl font-bold">$8,200.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1"> {/* Reduced padding */}
              <div className="space-y-0.5"> {/* Reduced spacing */}
                <CardTitle className="text-xl font-bold">Performance</CardTitle> {/* Smaller text */}
                <div className="flex items-center space-x-2 text-xs text-muted-foreground"> {/* Smaller text */}
                  <span>Email</span>
                  <span>|</span>
                  <span>From last 7 days</span>
                </div>
              </div>
              <Link href="#" className="text-blue-600 hover:underline flex items-center text-sm"> {/* Smaller text */}
                More analysis
                <ArrowRight className="ml-1 h-3 w-3" /> {/* Smaller icon */}
              </Link>
            </CardHeader>
            <CardContent className="pt-4"> {/* Reduced padding */}
              <div className="mb-4 h-[200px]"> {/* Reduced height */}
                <HexagonalHeatmap />
              </div>

              <div className="mb-4"> {/* Reduced margin */}
                <h3 className="text-base font-semibold mb-2">Best Stats</h3> {/* Smaller text and margin */}
                <div className="grid grid-cols-3 gap-3"> {/* Reduced gap */}
                  {bestStats.map((stat, index) => (
                    <div key={index} className="space-y-0.5"> {/* Reduced spacing */}
                      <div className="text-lg font-bold">{stat.value}</div> {/* Smaller text */}
                      <div className="text-xs text-muted-foreground">{stat.label}</div> {/* Smaller text */}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3"> {/* Reduced spacing */}
                <div className="grid grid-cols-12 gap-4 px-4">
                  <div className="col-span-5 text-xs font-medium text-muted-foreground">Metric</div> {/* Smaller text */}
                  <div className="col-span-4 text-xs font-medium text-muted-foreground">Privacy</div>
                  <div className="col-span-3 text-xs font-medium text-muted-foreground">Change</div>
                </div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-4"> {/* Reduced height and spacing */}
                  {metrics.map((metric, index) => (
                    <div key={index} className="grid grid-cols-12 items-center gap-4 px-4">
                      <div className="col-span-5 space-y-0.5"> {/* Reduced spacing */}
                        <div className="text-base font-semibold">{metric.value}</div> {/* Smaller text */}
                        <div className="text-xs text-muted-foreground">{metric.label}</div> {/* Smaller text */}
                      </div>
                      <div className="col-span-4 flex items-center space-x-2">
                        <Switch className="data-[state=checked]:bg-gray-900 h-4 w-8" /> {/* Smaller switch */}
                        <span className="text-xs font-medium">Private</span> {/* Smaller text */}
                      </div>
                      <div className="col-span-3 flex items-center justify-between">
                        <span className={`rounded-full ${getChangeColor(metric.changeType)} px-2 py-0.5 text-xs`}> {/* Smaller padding and text */}
                          {metric.change}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" /> {/* Smaller icon */}
                      </div>
                    </div>
                  ))}
                </div>
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