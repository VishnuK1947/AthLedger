// 'use client'

// import React, { useState } from "react"
// import { Search, Mail } from "lucide-react"
// import Image from "next/image"
// import Link from 'next/link'

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { UserButton, useUser } from "@clerk/nextjs"

// type Athlete = {
//   id: number
//   name: string
//   sport: string
//   image: string
//   stats: string
// }

// type AthleteCardProps = {
//   athlete: Athlete
// }

// function AthleteCard({ athlete }: AthleteCardProps) {
//   return (
//     <Card className="overflow-hidden">
//       <CardHeader className="p-0">
//         <Image
//           src={athlete.image}
//           alt={athlete.name}
//           width={400}
//           height={200}
//           className="w-full h-48 object-cover"
//         />
//       </CardHeader>
//       <CardContent className="p-4">
//         <CardTitle>{athlete.name}</CardTitle>
//         <p className="text-sm text-gray-500">{athlete.sport}</p>
//         <p className="mt-2 text-sm">{athlete.stats}</p>
//       </CardContent>
//       <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
//         <Button variant="outline" size="sm">
//           <Mail className="h-4 w-4 mr-2" />
//           Contact
//         </Button>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button size="sm">Request Data</Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Request Data from {athlete.name}</DialogTitle>
//               <DialogDescription>
//                 Specify the data you're interested in and submit your request.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <textarea
//                 placeholder="Describe the data you're requesting..."
//                 className="w-full p-2 border rounded-md"
//                 rows={4}
//               ></textarea>
//               <Button>Submit Request</Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </CardFooter>
//     </Card>
//   )
// }

// export default function Marketplace() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const { user } = useUser()

//   const athletes = [
//     {
//       id: 1,
//       name: "John Doe",
//       sport: "Swimming",
//       image: "/placeholder.svg?height=100&width=100",
//       stats: "100m Freestyle: 47.5s",
//     },
//     {
//       id: 2,
//       name: "Jane Smith",
//       sport: "Track and Field",
//       image: "/placeholder.svg?height=100&width=100",
//       stats: "Long Jump: 7.52m",
//     },
//     {
//       id: 3,
//       name: "Mike Johnson",
//       sport: "Basketball",
//       image: "/placeholder.svg?height=100&width=100",
//       stats: "Points per game: 22.3",
//     },
//     {
//       id: 4,
//       name: "Sarah Brown",
//       sport: "Gymnastics",
//       image: "/placeholder.svg?height=100&width=100",
//       stats: "All-Around Score: 58.765",
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="flex items-center justify-between bg-white p-4 shadow-sm">
//         <nav className="flex space-x-4">
//           <Link href="/company" passHref>
//             <Button variant="ghost" className="text-gray-500">
//               Dashboard
//             </Button>
//           </Link>
//           <Link href="/marketplace" passHref>
//             <Button variant="ghost" className="text-gray-900 font-semibold">
//               Marketplace
//             </Button>
//           </Link>
//         </nav>
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <UserButton afterSignOutUrl="/" />
//             <div className="text-sm">
//               <div className="font-medium">{user?.firstName || user?.username}</div>
//               <div className="text-muted-foreground">
//                 {user?.emailAddresses[0].emailAddress}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="p-6 space-y-6">
//         <h1 className="text-3xl font-bold">Athlete Marketplace</h1>

//         <div className="flex space-x-4">
//           <Input
//             type="text"
//             placeholder="Search athletes..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="flex-grow"
//           />
//           <Button>
//             <Search className="h-4 w-4 mr-2" />
//             Search
//           </Button>
//         </div>

//         <section>
//           <h2 className="text-2xl font-semibold mb-4">Recommended Athletes</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {athletes.slice(0, 3).map((athlete) => (
//               <AthleteCard key={athlete.id} athlete={athlete} />
//             ))}
//           </div>
//         </section>

//         <section>
//           <h2 className="text-2xl font-semibold mb-4">Public Athlete Data</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {athletes.map((athlete) => (
//               <AthleteCard key={athlete.id} athlete={athlete} />
//             ))}
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }
'use client'

import React, { useState, useMemo } from "react"
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
      name: "Lionel Messi",
      sport: "Soccer",
      image: "/athletes/messi.png",
      stats: "Goals per match: 0.84",
    },
    {
      id: 2,
      name: "LeBron James",
      sport: "Basketball",
      image: "/athletes/lebron.png",
      stats: "Points per game: 27.1",
    },
    {
      id: 3,
      name: "Serena Williams",
      sport: "Tennis",
      image: "/athletes/serena.png",
      stats: "Grand Slam titles: 23",
    },
    {
      id: 4,
      name: "Usain Bolt",
      sport: "Track and Field",
      image: "/athletes/bolt.png",
      stats: "100m Sprint: 9.58s",
    },
    {
      id: 5,
      name: "Simone Biles",
      sport: "Gymnastics",
      image: "/athletes/simon.png",
      stats: "All-Around Score: 60.832",
    },
    {
      id: 6,
      name: "Cristiano Ronaldo",
      sport: "Soccer",
      image: "/athletes/ronaldo.png",
      stats: "Goals per match: 0.75",
    },
    {
      id: 7,
      name: "Michael Phelps",
      sport: "Swimming",
      image: "/athletes/phelps.png",
      stats: "200m Butterfly: 1m 51.51s",
    },
    {
      id: 8,
      name: "Katie Ledecky",
      sport: "Swimming",
      image: "/athletes/katie.png",
      stats: "800m Freestyle: 8m 04.79s",
    },
    {
      id: 9,
      name: "Tom Brady",
      sport: "American Football",
      image: "/athletes/tombrady.png",
      stats: "Touchdowns per season: 38",
    },
    {
      id: 10,
      name: "Naomi Osaka",
      sport: "Tennis",
      image: "/athletes/naomiosaka.png",
      stats: "Aces per match: 8.4",
    },
  ]

  // Memoized filtered athletes
  const filteredAthletes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    
    if (!query) return athletes

    return athletes.filter(athlete => 
      athlete.name.toLowerCase().includes(query) ||
      athlete.sport.toLowerCase().includes(query) ||
      athlete.stats.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Get recommended athletes
  const recommendedAthletes = useMemo(() => {
    if (searchQuery) {
      return filteredAthletes.slice(0, 3)
    }
    return athletes.slice(0, 3)
  }, [searchQuery, filteredAthletes])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

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

        <form onSubmit={handleSearch} className="flex space-x-4">
          <Input
            type="text"
            placeholder="Search by name, sport, or stats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        {searchQuery && (
          <div className="text-sm text-gray-600">
            Found {filteredAthletes.length} athlete{filteredAthletes.length !== 1 ? 's' : ''}
          </div>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {searchQuery ? 'Top Results' : 'Recommended Athletes'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedAthletes.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            {searchQuery ? 'All Results' : 'Public Athlete Data'}
          </h2>
          {filteredAthletes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAthletes.map((athlete) => (
                <AthleteCard key={athlete.id} athlete={athlete} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No athletes found matching "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}