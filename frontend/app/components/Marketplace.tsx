'use client'

import React, { useState } from "react"
import { Search, Mail } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserButton, useUser } from "@clerk/nextjs"

type Athlete = {
  id: number
  name: string
  sport: string
  image: string
  stats: string
}

type AthleteCardProps = {
  athlete: Athlete
}

function AthleteCard({ athlete }: AthleteCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={athlete.image}
          alt={athlete.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle>{athlete.name}</CardTitle>
        <p className="text-sm text-gray-500">{athlete.sport}</p>
        <p className="mt-2 text-sm">{athlete.stats}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Request Data</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Data from {athlete.name}</DialogTitle>
              <DialogDescription>
                Specify the data you're interested in and submit your request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <textarea
                placeholder="Describe the data you're requesting..."
                className="w-full p-2 border rounded-md"
                rows={4}
              ></textarea>
              <Button>Submit Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useUser()

  const athletes = [
    {
      id: 1,
      name: "John Doe",
      sport: "Swimming",
      image: "/placeholder.svg?height=100&width=100",
      stats: "100m Freestyle: 47.5s",
    },
    {
      id: 2,
      name: "Jane Smith",
      sport: "Track and Field",
      image: "/placeholder.svg?height=100&width=100",
      stats: "Long Jump: 7.52m",
    },
    {
      id: 3,
      name: "Mike Johnson",
      sport: "Basketball",
      image: "/placeholder.svg?height=100&width=100",
      stats: "Points per game: 22.3",
    },
    {
      id: 4,
      name: "Sarah Brown",
      sport: "Gymnastics",
      image: "/placeholder.svg?height=100&width=100",
      stats: "All-Around Score: 58.765",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white p-4 shadow-sm">
        <nav className="flex space-x-4">
          <Link href="/company" passHref>
            <Button variant="ghost" className="text-gray-500">
              Dashboard
            </Button>
          </Link>
          <Link href="/marketplace" passHref>
            <Button variant="ghost" className="text-gray-900 font-semibold">
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
        <h1 className="text-3xl font-bold">Athlete Marketplace</h1>

        <div className="flex space-x-4">
          <Input
            type="text"
            placeholder="Search athletes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recommended Athletes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {athletes.slice(0, 3).map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Public Athlete Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {athletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}