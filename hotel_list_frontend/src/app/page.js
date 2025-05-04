"use client"

import Navbar from "@/components/navbar"
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {

  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredDestinations, setFilteredDestinations] = useState([])
  const searchRef = useRef(null)


  
  
  const destinations = [

    {
      title: "Dhaka",
      country: "Bangladesh",
      code: "DAC",
      image: "https://images.unsplash.com/photo-1706640254398-3b04782e8c76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Cityscape of Dhaka with modern buildings and traditional architecture"
    },
    
    {
      title: "Istanbul",
      country: "Turkey",
      code: "IST",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Istanbul skyline with the Blue Mosque and Bosphorus"
    },
    {
      title: "Kathmandu",
      country: "Nepal",
      code: "KTM",
      image: "https://images.unsplash.com/photo-1544085311-11a028465b03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Ancient temples and stupas in Kathmandu"
    },
    {
      title: "Lahore",
      country: "Pakistan",
      code: "LHE",
      image: "https://images.unsplash.com/photo-1622546758596-f1f06ba11f58?q=80&w=2121&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Historical architecture of Lahore with ornate designs"
    },
    {
      title: "Beijing",
      country: "China",
      code: "PEK",
      image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", 
      alt: "Great Wall of China near Beijing"
    },
    {
      title: "New York",
      country: "United States",
      code: "NYC",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "New York City skyline with Empire State Building"
    },
    {
      title: "London",
      country: "United Kingdom",
      code: "LON",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "London cityscape with Big Ben and the Thames"
    },
    {
      title: "Paris",
      country: "France",
      code: "PAR",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Paris with Eiffel Tower"
    },
    {
      title: "Tokyo",
      country: "Japan",
      code: "TYO",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Tokyo skyline with Mount Fuji in the background"
    },
    {
      title: "Rome",
      country: "Italy",
      code: "ROM",
      image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Rome with the Colosseum"
    },
    {
      title: "Sydney",
      country: "Australia",
      code: "SYD",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Sydney Opera House and harbor"
    },
    {
      title: "Barcelona",
      country: "Spain",
      code: "BCN",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Aerial view of Barcelona with Sagrada Familia"
    },
    {
      title: "Dubai",
      country: "United Arab Emirates",
      code: "DXB",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Dubai skyline with Burj Khalifa"
    },
    {
      title: "Amsterdam",
      country: "Netherlands",
      code: "AMS",
      image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Amsterdam canals with traditional houses"
    }
  ];


  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = destinations.filter(
        dest =>
          dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.country.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredDestinations(filtered);
      setShowSuggestions(true);
    }
    else
      setShowSuggestions(false)

  }, [searchQuery]);



  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSelectDestination = (destination) => {
    setSearchQuery(destination.title)
    setShowSuggestions(false)

    document.getElementById('search-input').classList.remove('ring-red-500');
    document.getElementById('search-error').classList.add('hidden');
  };


  const handleSearch = () => {

    if (!searchQuery.trim()) {
      // Show an error indication
      document.getElementById('search-input').classList.add('ring-red-500');
      document.getElementById('search-error').classList.remove('hidden');
      return;
    }


    const selectedDestination = destinations.find(
      dest => dest.title.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (selectedDestination) {
      router.push(`/search-filter?location=${selectedDestination.code}`);
    } else if (filteredDestinations.length > 0) {
      // If exact match not found but we have suggestions, use first suggestion
      router.push(`/search-filter?location=${filteredDestinations[0].code}`);
    } else {
      // If no match found, show validation error
      document.getElementById('search-input').classList.add('ring-red-500');
      document.getElementById('search-error').classList.remove('hidden');
    }
  };


  const handleCardClick = (locationCode) => {
    router.push(`/search-filter?location=${locationCode}`);
  };




  return (
    <>
      {/* TODO: decide where to put the navbar */}
      <Navbar />
      
      {/* Constrained container with padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Container heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Popular Location
          </h2>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Search or select a location (City) to find hotels
          </p>
        </div>
        
        {/* Search input and button */}
        <div className="mb-8">
          <div className="relative flex items-center max-w-md mx-auto">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                document.getElementById('search-input').classList.remove('ring-red-500');
                document.getElementById('search-error').classList.add('hidden');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="block w-full rounded-l-md border-0 py-3 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-indigo-500"
              placeholder="Search destinations..."
            />
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center rounded-r-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800"
            >
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
              <span className="ml-2">Search</span>
            </button>
            
            


            {showSuggestions && filteredDestinations.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-60 overflow-y-auto">
                {filteredDestinations.map((dest, index) => (
                  <div 
                    key={index}
                    onClick={() => handleSelectDestination(dest)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                  >
                    <div className="w-8 h-8 mr-2 rounded-full overflow-hidden flex-shrink-0">
                      <img src={dest.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">{dest.title}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">{dest.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
          <p id="search-error" className="text-red-500 text-sm mt-1 text-center mx-auto max-w-md hidden">
            Please enter a valid location (city).
          </p>
        </div>
        

        {/* Location cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((location, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(location.code)}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-lg cursor-pointer transform hover:-translate-y-1"
            >
              <div className="w-full h-48 relative">
                <img
                  src={location.image}
                  alt={location.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-6 py-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {location.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {location.country}
                </p>
                {/* <button className="mt-2 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800">
                  Find Hotels
                </button> */}
              </div>
            </div>
          ))}
        </div>        
      </div>
    </>
  )
}