"use client"

import { useEffect, useState } from 'react'
import Navbar from "@/components/navbar"
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, StarIcon, MapPinIcon, BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import authCheck from '@/components/authCheck'
import LocationAutocomplete from '@/components/locationAutoComplete'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locationCode = searchParams.get('location')

  // Search parameters state
  const [location, setLocation] = useState('')
  const [locationRequired, setLocationRequired] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [rooms, setRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  
  // Filter parameters state
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [starRatings, setStarRatings] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  })
  const [maxRatesPerRoom, setMaxRatesPerRoom] = useState(5)
  
  // API state
  const [loading, setLoading] = useState(false)
  const [hotels, setHotels] = useState([])
  const [error, setError] = useState(null)
  const [nextPage, setNextPage] = useState(1)
  
  // Filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false)

  // Location mapping for codes
  const locationMap = {
    'NYC': 'New York',
    'LON': 'London',
    'PAR': 'Paris',
    'TYO': 'Tokyo',
    'ROM': 'Rome',
    'SYD': 'Sydney',
    'BCN': 'Barcelona',
    'DXB': 'Dubai',
    'AMS': 'Amsterdam',
    'DAC': 'Dhaka',
    'IST': 'Istanbul',
    'KTM': 'Kathmandu',
    'LHE': 'Lahore',
    'PEK': 'Beijing'
  }

  // Reverse location mapping
  const reverseLocationMap = Object.entries(locationMap).reduce((acc, [code, name]) => {
    acc[name] = code;
    return acc;
  }, {});
  
  // State for bookmarked hotels
  const [bookmarked, setBookmarked] = useState({})

  // Get location code from location name
  const getLocationCode = (locationName) => {
    return reverseLocationMap[locationName] || locationName;
  }
  
  // Fetch hotels from API
  const fetchHotels = async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        throw new Error('Authentication required')
      }
      
      // Build query parameters
      const location_code = params.location_code || getLocationCode(location)
      
      if (!location_code) {
        setLocationRequired(true)
        setLoading(false)
        toast.error('Please select a location')
        return
      }
      
      // Reset location required error
      setLocationRequired(false)
      
      // Build query string
      const queryParams = new URLSearchParams({
        location_code,
        next_page: params.next_page || nextPage,
        rooms: params.rooms || rooms,
        adults: params.adults || adults,
        children: params.children || children,
        minRate: params.minRate || priceRange[0],
        maxRate: params.maxRate || priceRange[1],
        maxRatesPerRoom: params.maxRatesPerRoom || maxRatesPerRoom
      })
      
      // Add optional parameters only if they have values
      if (checkIn) queryParams.append('check_in', params.check_in || checkIn)
      if (checkOut) queryParams.append('check_out', params.check_out || checkOut)
      
      // Add min/max category based on star ratings
      const selectedStars = Object.entries(starRatings)
        .filter(([_, isSelected]) => isSelected)
        .map(([star, _]) => parseInt(star))
      
      if (selectedStars.length > 0) {
        queryParams.append('minCategory', Math.min(...selectedStars))
        queryParams.append('maxCategory', Math.max(...selectedStars))
      }
      
      // Make API request
      const response = await fetch(`http://localhost:8000/hotels/search/?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch hotels')
      }
      
      // Parse and store hotel data
      const data = await response.json()
      
      // Update hotels state
      setHotels(data)
      setNextPage(prev => prev + 1)
      
      // Show success message
      toast.success(`Found ${data.length} hotels`)
      
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setError("Failed to fetch hotels. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Handle initial load with location code from URL
  useEffect(() => {
    if (locationCode) {
      // Set location from URL parameter
      setLocation(locationMap[locationCode] || locationCode)
      
      // Fetch hotels with location code on initial load
      fetchHotels({ location_code: locationCode, next_page: 1 })
    }
  }, [locationCode])
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }
  
  // Set default check-in/out dates if not set
  useEffect(() => {
    if (!checkIn) {
      const today = new Date()
      setCheckIn(formatDate(today))
    }
    
    if (!checkOut) {
      const threeDaysLater = new Date()
      threeDaysLater.setDate(threeDaysLater.getDate() + 3)
      setCheckOut(formatDate(threeDaysLater))
    }
  }, [])
  



  const toggleBookmark = async (hotelId) => {
    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        toast.error('Authentication required to bookmark hotels')
        return
      }
      
      // Check if the hotel is already bookmarked locally
      const isCurrentlyBookmarked = bookmarked[hotelId]
      
      // Optimistically update UI
      setBookmarked(prev => ({
        ...prev,
        [hotelId]: !isCurrentlyBookmarked
      }))
      
      // Prepare API call
      const url = 'http://localhost:8000/bookmarks/'
      
      // Use DELETE method if the hotel is already bookmarked, otherwise use POST
      if (isCurrentlyBookmarked) {
        
        const formData = new FormData()
        formData.append('hotel_code', hotelId)

        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body : formData
        })
        
        if (!response.ok) {
          // If API call fails, revert the optimistic update
          setBookmarked(prev => ({
            ...prev,
            [hotelId]: isCurrentlyBookmarked
          }))
          
          throw new Error('Failed to remove bookmark')
        }
        
        // Show success message
        toast.info("Hotel removed from bookmarks")
      } else {
        // POST request to add the bookmark
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            hotel_code: hotelId
          })
        })
        
        if (!response.ok) {
          // If API call fails, revert the optimistic update
          setBookmarked(prev => ({
            ...prev,
            [hotelId]: isCurrentlyBookmarked
          }))
          
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to add bookmark')
        }
        
        // Show success message
        toast.success("Hotel added to bookmarks!")
      }
      
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast.error(error.message || 'Failed to update bookmark')
      
      // Revert UI state if there was an error
      setBookmarked(prev => ({
        ...prev,
        [hotelId]: !prev[hotelId]
      }))
    }
  }


  // Add a new useEffect for fetching existing bookmarks

// Fetch user's existing bookmarks
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        
        if (!accessToken) {
          return
        }
        
        const response = await fetch('http://localhost:8000/bookmarks/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks')
        }
        
        const bookmarkData = await response.json()
        
        // Create a map of hotel_id -> true for all bookmarked hotels
        const bookmarkMap = {}
        bookmarkData.forEach(bookmark => {
          bookmarkMap[bookmark.hotel_code] = true
        })
        
        setBookmarked(bookmarkMap)
        
      } catch (error) {
        console.error('Error fetching bookmarks:', error)
        // Don't show error toast for this since it's not critical
      }
    }
    
    fetchUserBookmarks()
  }, [])
  
  // Handle star rating filter change
  const handleStarRatingChange = (rating) => {
    setStarRatings(prev => ({
      ...prev,
      [rating]: !prev[rating]
    }))
  }
  
  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault()
    
    // Reset page to 1 when performing a new search
    setNextPage(1)
    
    // Fetch hotels with current search parameters
    fetchHotels({ next_page: 1 })
  }
  
  // Handle apply filters button
  const applyFilters = () => {
    // Reset page to 1 when applying new filters
    setNextPage(1)
    
    // Fetch hotels with current filter parameters
    fetchHotels({ next_page: 1 })
  }
  
  // Get default image based on hotel rating
  const getDefaultHotelImage = (rating) => {
    const ratingNum = parseInt(rating) || 3
    const images = {
      1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      2: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      3: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      4: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      5: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
    return images[ratingNum] || images[3]
  }

  return (
    <>
      <Navbar />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Constrained container with padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Container heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Search and Filter Hotels
          </h2>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Only the available hotels will be shown based on your search criteria.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Location - 3 columns */}
            <div className="md:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <LocationAutocomplete 
                value={location}
                onChange={setLocation}
                initialCode={locationCode}
              />
              {locationRequired && (
                <p className="mt-1 text-sm text-red-500">Location is required</p>
              )}
            </div>
            
            {/* Dates - 3 columns */}
            <div className="grid grid-cols-2 gap-3 md:col-span-3">
              <div>
                <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Check in
                </label>
                <input
                  id="check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Check out
                </label>
                <input
                  id="check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500"
                />
              </div>
            </div>
            
            {/* Room, Adults, Children - 4 columns (wider) */}
            <div className="grid grid-cols-3 gap-3 md:col-span-4">
              <div>
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rooms
                </label>
                <div className="flex rounded-md border border-gray-300 dark:border-gray-600">
                  <button 
                    type="button"
                    onClick={() => setRooms(prev => Math.max(1, prev - 1))}
                    className="px-2 py-1 rounded-l-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="rooms"
                    value={rooms}
                    onChange={(e) => setRooms(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full p-2 text-center border-y-0 border-x-0 focus:ring-0 dark:bg-gray-700 dark:text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setRooms(prev => prev + 1)}
                    className="px-2 py-1 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="adults" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adults
                </label>
                <div className="flex rounded-md border border-gray-300 dark:border-gray-600">
                  <button 
                    type="button"
                    onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    className="px-2 py-1 rounded-l-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="adults"
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full p-2 text-center border-y-0 border-x-0 focus:ring-0 dark:bg-gray-700 dark:text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setAdults(prev => prev + 1)}
                    className="px-2 py-1 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="children" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Children
                </label>
                <div className="flex rounded-md border border-gray-300 dark:border-gray-600">
                  <button 
                    type="button"
                    onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    className="px-2 py-1 rounded-l-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="children"
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="w-full p-2 text-center border-y-0 border-x-0 focus:ring-0 dark:bg-gray-700 dark:text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setChildren(prev => prev + 1)}
                    className="px-2 py-1 rounded-r-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Search button - 2 columns (narrower) */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        
        {/* Filter toggle for mobile */}
        <div className="md:hidden mb-4">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
        
        {/* Main content area with filters and results */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar - hidden on mobile by default */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-1/4`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filters</h3>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</h4>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-gray-600 dark:text-gray-400">${priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-gray-600 dark:text-gray-400">${priceRange[1]}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400">${priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-gray-600 dark:text-gray-400">${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Star Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Star Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        id={`star-${rating}`}
                        type="checkbox"
                        checked={starRatings[rating]}
                        onChange={() => handleStarRatingChange(rating)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600"
                      />
                      <label htmlFor={`star-${rating}`} className="ml-2 flex items-center">
                        {Array(rating).fill().map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                        {Array(5-rating).fill().map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                        ))}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Max Rates Per Room Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Star Rating per Room</h4>
                <select
                  value={maxRatesPerRoom}
                  onChange={(e) => setMaxRatesPerRoom(parseInt(e.target.value))}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <option key={rate} value={rate}>
                      {rate} {rate === 1 ? 'Star' : 'Stars'} or less
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Apply Filters Button */}
              <button
                type="button"
                disabled={loading}
                className="w-full flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={applyFilters}
              >
                {loading ? 'Applying...' : 'Apply Filters'}
              </button>
            </div>
          </div>
          
          {/* Hotel listings */}
          <div className="flex-1">
            {loading && hotels.length === 0 ? (
              // Loading skeleton
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden animate-pulse">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 md:h-auto bg-gray-300 dark:bg-gray-700"></div>
                      <div className="p-4 md:p-6 flex-1">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">{error}</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      fetchHotels({ next_page: 1 })
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : hotels.length === 0 ? (
              // Empty state
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No hotels found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset filters
                      setPriceRange([0, 1000])
                      setStarRatings({1: false, 2: false, 3: false, 4: false, 5: false})
                      setMaxRatesPerRoom(5)
                      // Only search if location is set
                      if (location) {
                        fetchHotels({ next_page: 1 })
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            ) : (
              // Hotel results
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2 px-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} found
                  </p>
                  <div>
                    <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400 mr-2">Sort by:</label>
                    <select
                      id="sort"
                      className="p-1 text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      onChange={(e) => {
                        const value = e.target.value;
                        let sorted = [...hotels];
                        if (value === 'price-low') {
                          sorted.sort((a, b) => a.avg_price_rate - b.avg_price_rate);
                        } else if (value === 'price-high') {
                          sorted.sort((a, b) => b.avg_price_rate - a.avg_price_rate);
                        } else if (value === 'stars-high') {
                          sorted.sort((a, b) => b.rating - a.rating);
                        } else if (value === 'stars-low') {
                          sorted.sort((a, b) => a.rating - b.rating);
                        }
                        setHotels(sorted);
                      }}
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="stars-high">Stars: High to Low</option>
                      <option value="stars-low">Stars: Low to High</option>
                    </select>
                  </div>
                </div>
                
                {hotels.map((hotel) => (
                  <div key={hotel.hotel_id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all hover:shadow-lg">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 md:h-auto">
                        <img 
                          src={hotel.image || getDefaultHotelImage(hotel.rating)} 
                          alt={hotel.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
                                {hotel.name}
                              </h3>
                              <div className="flex items-center mb-2">
                                {/* Extract numeric rating from string (e.g., "5 STARS" -> 5) */}
                                {Array(parseInt(hotel.rating) || 3).fill().map((_, i) => (
                                  <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                                {Array(5 - (parseInt(hotel.rating) || 3)).fill().map((_, i) => (
                                  <StarIcon key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => toggleBookmark(hotel.hotel_id)}
                              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
                              aria-label={bookmarked[hotel.hotel_id] ? "Remove from bookmarks" : "Add to bookmarks"}
                            >
                              {bookmarked[hotel.hotel_id] ? (
                                <BookmarkSolid className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <BookmarkOutline className="h-6 w-6" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{hotel.address || `${hotel.city}, ${hotel.countryCode}`}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                            {hotel.description || "No description available"}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${hotel.avg_price_rate ? hotel.avg_price_rate.toFixed(2) : '0.00'}
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              /{hotel.currency || 'night'}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                            onClick={() => {
                              // Navigate to hotel details page
                              router.push(`/hotel-details/${hotel.hotel_id}?checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${adults}&children=${children}`)
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Load more button */}
                {hotels.length > 0 && (
                  <div className="text-center mt-6">
                    <button
                      type="button"
                      onClick={() => fetchHotels()}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700 dark:text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading more...
                        </>
                      ) : (
                        'Load More Hotels'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default authCheck(SearchFilter)