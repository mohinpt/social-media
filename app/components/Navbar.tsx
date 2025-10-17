"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Search, Home, MessageCircle, Heart, PlusSquare, Menu, User, Settings, LogOut } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useSearch } from "@/context/SearchContext"

export default function Navbar() {

  const { data: session } = useSession()
  const user = session?.user;

  const { setQuery } = useSearch()
  const [search, setSearch] = useState("")

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQuery(search)
    }, 400)
    return () => clearTimeout(debounce)
  }, [search, setQuery])


  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 lg:px-[10%]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-xl tracking-tight">CialeApp</h1>
            </Link>
          </div>

          {/* Search Bar*/}
          <div className="flex items-center space-x-2 flex-1 mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-10 bg-muted/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation Icons*/}
          <div className="flex items-center space-x-4">
            {/* Navigation Icons - Hidden on mobile*/}
            <div className="hidden md:flex ">
              <Button variant="ghost" size="icon" className="hidden md:inline-flex"
              >
                <Home className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <PlusSquare className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* User Avatar with Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.username.split(' ').map((n:string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{user.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {
              !user && <Button variant="ghost"
                onClick={() => signIn()} >
                <User className="w-5 h-5" />
              </Button>
            }

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-6">
                  <Button variant="ghost" className="justify-start"
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Home
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Messages
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Heart className="w-5 h-5 mr-3" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <PlusSquare className="w-5 h-5 mr-3" />
                    Create
                  </Button>
                  <Button variant="ghost" className="justify-start"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Button>

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}