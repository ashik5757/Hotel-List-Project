"use client"

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const navigation = [
  { name: 'Home', href: '/', current: true },
  { 
    name: 'Hotels',
    href: '#',
    current: false,
    subNav: [
      { name: 'Search & Filter', href: '/search-filter' },
      { name: 'Bookmarks', href: '/bookmarks' },
    ] 
  },
  { name: 'About', href: '/about', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const router = useRouter()
  
  const [darkMode, setDarkMode] = useState(false)
  // Add state to track user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  // Apply dark mode class to document when darkMode state changes
  useEffect(() => {
    // Check if user has already set a preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDarkMode)
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Check for JWT tokens to determine login status
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    // User is logged in if both tokens exist
    const loggedIn = !!(accessToken && refreshToken)
    setIsLoggedIn(loggedIn)


    if (loggedIn) {

      try {

        const payloadBase64 = accessToken.split('.')[1]
        const payload = JSON.parse(atob(payloadBase64))
        
        // Extract username from token if available
        if (payload.username) {
          setUsername(payload.username)
        } else if (payload.sub) {
          // 'sub' is a common JWT claim for subject/username
          setUsername(payload.sub)
        }
      } catch (err) {
          console.error('Error parsing JWT token:', err)
      }
          

    }



  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // For demo purposes - toggle login state
  const handleLogin = () => {
    if (!isLoggedIn) {
      // This is just for demo purposes
      // localStorage.setItem('userToken', 'demo-token')
      // setIsLoggedIn(true)
      router.push('/login')
    }
  }

  const handleLogout = async () => {

    try {

      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await fetch('http://localhost:8000/accounts/logout/', {
        method : 'POST',
        headers : {
          'content-Type' : 'application/json',
          'Authorization' : `Bearer ${accessToken}`
        },
        body : JSON.stringify({
          refresh: refreshToken
        })
      })


      if (response.ok)
        console.log('Logout successful')
      else {
        console.error('Logout API failed. But logout from local storage is still successful')
      }

      
    } catch (error) { 
      console.error('Error during Logout:', error)
    } finally {

      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsLoggedIn(false)
      setUsername('')


      router.push('/')
      router.refresh()
    }
      
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:text-gray-300 dark:hover:bg-gray-800">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  item.subNav ? (
                    // Menu dropdown for items with subNav
                    <Menu as="div" key={item.name} className="relative inline-block text-left">
                      <div>
                        <MenuButton
                          className={classNames(
                            item.current 
                              ? 'bg-gray-900 text-white dark:bg-gray-700' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-800',
                            'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                          )}
                        >
                          {item.name}
                          <ChevronDownIcon className="ml-1.5 -mr-0.5 h-4 w-4" aria-hidden="true" />
                        </MenuButton>
                      </div>
                      <MenuItems
                        transition
                        className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-800 dark:ring-gray-700"
                      >
                        {item.subNav.map((subItem) => (
                          <MenuItem key={subItem.name}>
                            <a
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none dark:text-gray-200 dark:data-[focus]:bg-gray-700"
                            >
                              {subItem.name}
                            </a>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Menu>
                  ) : (
                    // Regular link for items without subNav
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current 
                          ? 'bg-gray-900 text-white dark:bg-gray-700' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-800',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            
            <button
              onClick={toggleDarkMode}
              type="button"
              className="relative mr-3 rounded-full bg-gray-700 p-1.5 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="size-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="size-5" aria-hidden="true" />
              )}
            </button>
            
            {!isLoggedIn ? (
              <div className="hidden sm:ml-6 sm:flex space-x-2 mr-4">
                <Link 
                  href="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-md px-3 py-2 text-sm font-medium dark:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  SignUp
                </Link>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:bg-gray-700"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View bookmarks</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3.75h10.5c.69 0 1.25.56 1.25 1.25v15.19c0 .7-.79 1.1-1.35.7l-5.4-3.78a.75.75 0 0 0-.9 0l-5.4 3.78c-.56.4-1.35 0-1.35-.7V5c0-.69.56-1.25 1.25-1.25z"
                    />
                  </svg>
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:bg-gray-700">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt="https://plus.unsplash.com/premium_vector-1744196876793-01fdcc4cb850?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        src="https://plus.unsplash.com/premium_vector-1744196876793-01fdcc4cb850?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="size-8 rounded-full"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-800 dark:ring-gray-700"
                  >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none dark:text-gray-200 dark:data-[focus]:bg-gray-700"
                      >
                        Your Profile
                      </a>
                    </MenuItem>

                    <MenuItem>
                      <a
                        href="#"
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none dark:text-gray-200 dark:data-[focus]:bg-gray-700"
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <div key={item.name}>
              <DisclosureButton
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current 
                    ? 'bg-gray-900 text-white dark:bg-gray-700' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-800',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
              
              {/* Show subnav items indented if present */}
              {item.subNav && (
                <div className="pl-4 mt-1 space-y-1">
                  {item.subNav.map(subItem => (
                    <DisclosureButton
                      key={subItem.name}
                      as="a"
                      href={subItem.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-800"
                    >
                      {subItem.name}
                    </DisclosureButton>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Add login/logout options to mobile menu */}
          {!isLoggedIn ? (
            <>
              <Link 
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="block rounded-md px-3 py-2 text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
              >
                SignUp
              </Link>
            </>
          ) : (
            <DisclosureButton
              as="a"
              href="#"
              onClick={handleLogout}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-800"
            >
              Sign out
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}