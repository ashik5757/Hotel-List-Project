"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function authCheck(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {

      // if (typeof window !== 'undefined') {
      //   const isDark = localStorage.getItem('darkMode') === 'true' || 
      //                 document.documentElement.classList.contains('dark')
      //   setIsDarkMode(isDark)
      // }

      
      // Check if user is authenticated
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!accessToken || !refreshToken) {
        // User is not authenticated, redirect to login
        toast.error('Please login to access this page', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        

        router.push('/login')

      } else {
        // User is authenticated
        setIsAuthenticated(true)
      }
      
      setLoading(false)
    }, [router])

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-300 dark:text-gray-300">Loading...</p>
          </div>
          <ToastContainer />
        </div>
      )
    }

    // Only render the component if authenticated
    return isAuthenticated ? (
      <>
        <Component {...props} />
        <ToastContainer />
      </>
    ) : null
  }
}