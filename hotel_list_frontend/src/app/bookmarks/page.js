"use client"

import { useState, useEffect } from 'react'
import Navbar from "@/components/navbar"
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, StarIcon, MapPinIcon, BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

import authCheck from '@/components/authCheck'

function Bookmarks() {
  const router = useRouter()
  
  // Search parameters state
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
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
  
  // Filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false)
  
  // State for bookmarked hotels and displayed hotels
  const [bookmarkedHotels, setBookmarkedHotels] = useState([])
  const [displayedHotels, setDisplayedHotels] = useState([])
  
  // Fetch bookmarked hotels on component mount
  useEffect(() => {
    fetchBookmarkedHotels()
  }, [])
  
  // Fetch bookmarked hotels from API
  const fetchBookmarkedHotels = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        throw new Error('Authentication required')
      }
      
      const response = await fetch('http://localhost:8000/bookmarks/search/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch bookmarked hotels')
      }
      
      const data = await response.json()
      setBookmarkedHotels(data)
      setDisplayedHotels(data)
      
    } catch (error) {
      console.error('Error fetching bookmarked hotels:', error)
      setError("Failed to fetch bookmarked hotels")
      // toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Function to filter hotels based on search and filters
  const filterAndDisplayHotels = (query, applyFilters = false) => {
    // Start with all bookmarked hotels
    let filtered = [...bookmarkedHotels]
    
    // Apply search query if provided
    if (query) {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(hotel => 
        (hotel.name && hotel.name.toLowerCase().includes(lowercaseQuery)) || 
        (hotel.description && hotel.description.toLowerCase().includes(lowercaseQuery)) ||
        (hotel.address && hotel.address.toLowerCase().includes(lowercaseQuery)) ||
        (hotel.city && hotel.city.toLowerCase().includes(lowercaseQuery))
      )
    }
    
    // Apply other filters if requested
    if (applyFilters) {
      // Price range filter
      filtered = filtered.filter(hotel => {
        const price = hotel.avg_price_rate || 0
        return price >= priceRange[0] && price <= priceRange[1]
      })
      
      // Star rating filter
      const anyStarSelected = Object.values(starRatings).some(value => value)
      if (anyStarSelected) {
        filtered = filtered.filter(hotel => {
          // Convert rating to number (if it's a string like "4 STARS")
          const rating = parseInt(hotel.rating) || 0
          return starRatings[rating]
        })
      }
      
      // Max rates per room filter
      filtered = filtered.filter(hotel => {
        const rating = parseInt(hotel.rating) || 0
        return rating <= maxRatesPerRoom
      })
    }
    
    setDisplayedHotels(filtered)
  }
  
  // Handle bookmark toggle (remove the bookmark)
  const removeBookmark = async (hotelId) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      
      if (!accessToken) {
        toast.error('Authentication required to remove bookmark')
        return
      }
      
      // Create form data for DELETE request
      const formData = new FormData()
      formData.append('hotel_code', hotelId)
      
      // Call the DELETE API endpoint
      const response = await fetch('http://localhost:8000/bookmarks/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove bookmark')
      }
      
      // Success - remove the hotel from the displayed list
      setBookmarkedHotels(prevHotels => prevHotels.filter(hotel => hotel.hotel_id !== hotelId))
      setDisplayedHotels(prevHotels => prevHotels.filter(hotel => hotel.hotel_id !== hotelId))
      
      toast.info("Hotel removed from bookmarks")
      
    } catch (error) {
      console.error('Error removing bookmark:', error)
      toast.error(error.message || 'Failed to remove bookmark')
    }
  }
  
  // Handle search submit
  const handleSearch = () => {
    filterAndDisplayHotels(searchQuery)
  }
  
  // Handle star rating filter change
  const handleStarRatingChange = (rating) => {
    setStarRatings(prev => ({
      ...prev,
      [rating]: !prev[rating]
    }))
  }
  
  // Apply all filters
  const applyFilters = () => {
    filterAndDisplayHotels(searchQuery, true)
    toast.info("Filters applied")
  }
  
  // Get default hotel image based on rating
  const getDefaultHotelImage = (rating) => {
    const ratingNum = parseInt(rating) || 3
    return `https://images.unsplash.com/photo-${ratingNum === 5 ? '1551882547-ff40c63fe5fa' : 
            ratingNum === 4 ? '1520250497591-112f2f40a3f4' : 
            ratingNum === 3 ? '1571896349842-33c89424de2d' : 
            ratingNum === 2 ? '1517840901100-8179e982acb7' : 
            '1566073771259-6a8506099945'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`
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
            Your Bookmarked Hotels
          </h2>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Only the available bookmarked hotels will be shown here.
          </p>
        </div>

        {/* Search input and button */}
        <div className="mb-8">
          <div className="relative flex items-center max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="block w-full rounded-l-md border-0 py-3 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-indigo-500"
              placeholder="Search Hotels..."
            />
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center rounded-r-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800"
            >
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              <span className="ml-2">Search</span>
            </button>
          </div>
        </div>

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
                className="w-full flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Hotel listings */}
          <div className="flex-1">
            {loading ? (
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
                    onClick={fetchBookmarkedHotels}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : displayedHotels.length === 0 ? (
              // Empty state
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  No bookmarked hotels found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchQuery ? 
                    "No hotels match your search criteria. Try adjusting your search or filters." :
                    "You haven't bookmarked any hotels yet. Start exploring and save your favorites!"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setDisplayedHotels(bookmarkedHotels)
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Clear Search
                  </button>
                )}
                {bookmarkedHotels.length === 0 && (
                  <button
                    onClick={() => router.push('/search-filter')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                  >
                    Find Hotels
                  </button>
                )}
              </div>
            ) : (
              // Hotel listings
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2 px-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    {displayedHotels.length} {displayedHotels.length === 1 ? 'hotel' : 'hotels'} found
                  </p>
                  <div>
                    <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400 mr-2">Sort by:</label>
                    <select
                      id="sort"
                      className="p-1 text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      onChange={(e) => {
                        const value = e.target.value;
                        let sorted = [...displayedHotels];
                        
                        if (value === 'price-low') {
                          sorted.sort((a, b) => (a.avg_price_rate || 0) - (b.avg_price_rate || 0));
                        } else if (value === 'price-high') {
                          sorted.sort((a, b) => (b.avg_price_rate || 0) - (a.avg_price_rate || 0));
                        } else if (value === 'stars-high') {
                          sorted.sort((a, b) => (parseInt(b.rating) || 0) - (parseInt(a.rating) || 0));
                        } else if (value === 'stars-low') {
                          sorted.sort((a, b) => (parseInt(a.rating) || 0) - (parseInt(b.rating) || 0));
                        } else if (value === 'date-added') {
                          sorted.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
                        }
                        
                        setDisplayedHotels(sorted);
                      }}
                    >
                      <option value="date-added">Most Recently Added</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="stars-high">Stars: High to Low</option>
                      <option value="stars-low">Stars: Low to High</option>
                    </select>
                  </div>
                </div>
                
                {displayedHotels.map((hotel) => (
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
                                {Array(parseInt(hotel.rating) || 3).fill().map((_, i) => (
                                  <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                                {Array(5 - (parseInt(hotel.rating) || 3)).fill().map((_, i) => (
                                  <StarIcon key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => removeBookmark(hotel.hotel_id)}
                              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
                              aria-label="Remove from bookmarks"
                            >
                              <BookmarkSolid className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </button>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{hotel.address || `${hotel.city}, ${hotel.countryCode}`}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                            {hotel.description || "No description available"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Added on: {new Date(hotel.date_added).toLocaleDateString()}
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
                            onClick={() => router.push(`/hotel-details/${hotel.hotel_id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default authCheck(Bookmarks)