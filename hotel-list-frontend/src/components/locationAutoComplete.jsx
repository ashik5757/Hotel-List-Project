"use client"

import { useState, useEffect, useRef } from 'react'

export default function LocationAutocomplete({ value, onChange, initialCode = null }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState([])
  const inputRef = useRef(null)
  
  // Location data with codes
  const locations = [
    { name: 'New York', country: 'United States', code: 'NYC' },
    { name: 'London', country: 'United Kingdom', code: 'LON' },
    { name: 'Paris', country: 'France', code: 'PAR' },
    { name: 'Tokyo', country: 'Japan', code: 'TYO' },
    { name: 'Rome', country: 'Italy', code: 'ROM' },
    { name: 'Sydney', country: 'Australia', code: 'SYD' },
    { name: 'Barcelona', country: 'Spain', code: 'BCN' },
    { name: 'Dubai', country: 'United Arab Emirates', code: 'DXB' },
    { name: 'Amsterdam', country: 'Netherlands', code: 'AMS' },
    { name: 'Dhaka', country: 'Bangladesh', code: 'DAC' },
    { name: 'Istanbul', country: 'Turkey', code: 'IST' },
    { name: 'Kathmandu', country: 'Nepal', code: 'KTM' },
    { name: 'Lahore', country: 'Pakistan', code: 'LHE' },
    { name: 'Beijing', country: 'China', code: 'PEK' }
  ]
  
  
  // Set initial value based on location code
  useEffect(() => {
    if (initialCode && value === '') {
      const matchingLocation = locations.find(loc => loc.code === initialCode)
      if (matchingLocation) {
        onChange(matchingLocation.name)
      }
    }
  }, [initialCode, onChange, value])


  // Filter locations based on input value
  useEffect(() => {
    if (value.length > 0) {
      const filtered = locations.filter(
        loc => 
          loc.name.toLowerCase().includes(value.toLowerCase()) ||
          loc.country.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredLocations(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [value])
  
  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  // Handle selection from suggestions
  const handleSelect = (location) => {
    onChange(location.name)
    setShowSuggestions(false)
  }
  
  return (
    <div className="relative" ref={inputRef}>
      <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md border-0 py-2 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 dark:focus:ring-indigo-500"
      placeholder="Where are you going?"
      />
      
      {showSuggestions && filteredLocations.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-60 overflow-y-auto">
          {filteredLocations.map((loc, index) => (
            <div 
              key={index}
              onClick={() => handleSelect(loc)}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="text-gray-900 dark:text-white font-medium">{loc.name}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{loc.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}