import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCardStore } from '../store/useCardStore';
import { useUserReportsStore } from '../store/useUserReportsStore';
import { useLocation } from 'react-router-dom';
import type { Issue } from '../types/issue';
import Modal from '../components/Modal';
import { Card } from '../components/Card';
import { RecentCards } from '../components/RecentCards';

interface Filters {
  category: string;
  status: string;
  distance: string;
}

const Home = () => {
  const { isLoggedIn, user } = useAuthStore();
  const { openModal } = useCardStore();
  const { reports: userReports } = useUserReportsStore();
  const location = useLocation();
  const [filters, setFilters] = useState<Filters>({
    category: '',
    status: '',
    distance: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const categories = [
    'All Categories',
    'Road & Transportation',
    'Water & Sanitation',
    'Public Safety',
    'Parks & Recreation',
    'Street Lighting',
    'Waste Management',
    'Noise Complaints',
    'Other'
  ];

  const statuses = [
    'All Status',
    'Open',
    'In Progress',
    'Resolved',
    'Closed'
  ];

  const distances = [
    'All Distances',
    'Within 1 km',
    'Within 2 km',
    'Within 3 km',
    'Within 4 km',
    'Within 5 km'
  ];

  const getUserLocation = async () => {
    return new Promise<void>((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser.');
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          resolve();
        },
        (error) => {
          console.warn('Error getting location:', error);
          resolve();
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  };

  const filterIssuesByLocation = (allIssues: Issue[]): Issue[] => {
    if (isLoggedIn) {
      return [];
    }
    
    return allIssues;
  };

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (isLoggedIn && !userLocation) {
        await getUserLocation();
      }
      
      const sampleIssues: Issue[] = [
        {
          id: "1",
          title: "Large pothole on Main Street",
          description: "Dangerous pothole causing vehicle damage near the intersection with Oak Avenue. Water collects here during rain, making it even more hazardous for drivers and pedestrians.",
          category: "Road & Transportation",
          status: "in-progress",
          location: {
            lat: 40.7580,
            lng: -73.9855,
            address: "123 Main Street, New York, NY 10001"
          },
          images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&crop=entropy&auto=format"],
          submittedAt: "2025-01-30T10:30:00Z",
          updatedAt: "2025-02-01T14:20:00Z",
          submittedBy: "John Smith",
          isAnonymous: false,
          votes: 23,
          priority: "high",
          distance: "0.5 km",
          reportedDate: "2 days ago"
        },
        {
          id: 2,
          title: "Broken street light on Park Avenue",
          description: "Street light has been out for over a week, creating safety concerns for pedestrians at night.",
          category: "Street Lighting",
          status: "Open",
          distance: "1.2 km",
          image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "1 week ago"
        },
        {
          id: 3,
          title: "Overflowing garbage bins",
          description: "Multiple garbage bins overflowing in Central Park area, attracting pests and creating unsanitary conditions.",
          category: "Waste Management",
          status: "Resolved",
          distance: "2.1 km",
          image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "3 days ago"
        },
        {
          id: 4,
          title: "Water leak on Elm Street",
          description: "Continuous water leak from underground pipe causing road damage and water wastage.",
          category: "Water & Sanitation",
          status: "In Progress",
          distance: "0.8 km",
          image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "5 days ago"
        },
        {
          id: 5,
          title: "Vandalized park bench",
          description: "Park bench has been damaged by vandalism, making it unsafe and unusable for visitors.",
          category: "Parks & Recreation",
          status: "Open",
          distance: "3.2 km",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "1 day ago"
        },
        {
          id: 6,
          title: "Noise complaint - Construction",
          description: "Excessive noise from construction work starting before permitted hours, disturbing residents.",
          category: "Noise Complaints",
          status: "Closed",
          distance: "1.7 km",
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "2 weeks ago"
        },
        {
          id: 7,
          title: "Damaged sidewalk near school",
          description: "Cracked and uneven sidewalk creating tripping hazards for children and pedestrians.",
          category: "Road & Transportation",
          status: "Open",
          distance: "2.3 km",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "4 days ago"
        },
        {
          id: 8,
          title: "Malfunctioning traffic signal",
          description: "Traffic light stuck on red causing major traffic delays during rush hour.",
          category: "Public Safety",
          status: "In Progress",
          distance: "1.9 km",
          image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "6 hours ago"
        },
        {
          id: 9,
          title: "Graffiti on public building",
          description: "Offensive graffiti vandalism on the community center wall needs immediate removal.",
          category: "Public Safety",
          status: "Open",
          distance: "4.1 km",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "3 days ago"
        },
        {
          id: 10,
          title: "Blocked storm drain",
          description: "Storm drain clogged with debris causing street flooding during rain.",
          category: "Water & Sanitation",
          status: "Open",
          distance: "1.4 km",
          image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "1 week ago"
        },
        {
          id: 11,
          title: "Playground equipment broken",
          description: "Swing set chains broken and slide has sharp edges, unsafe for children.",
          category: "Parks & Recreation",
          status: "In Progress",
          distance: "2.8 km",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "5 days ago"
        },
        {
          id: 12,
          title: "Dead tree hazard",
          description: "Large dead tree leaning over power lines poses safety risk to residents.",
          category: "Public Safety",
          status: "Open",
          distance: "3.7 km",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "2 days ago"
        },
        {
          id: 13,
          title: "Illegal dumping site",
          description: "Large pile of construction debris dumped illegally behind shopping center.",
          category: "Waste Management",
          status: "Open",
          distance: "4.8 km",
          image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "1 week ago"
        },
        {
          id: 14,
          title: "Flickering street lamps",
          description: "Multiple street lamps flickering on residential street affecting visibility.",
          category: "Street Lighting",
          status: "Resolved",
          distance: "2.6 km",
          image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "3 weeks ago"
        },
        {
          id: 15,
          title: "Loose manhole cover",
          description: "Manhole cover rattles and shifts when vehicles pass over it, potential safety hazard.",
          category: "Road & Transportation",
          status: "In Progress",
          distance: "1.1 km",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "4 days ago"
        },
        {
          id: 16,
          title: "Abandoned vehicle",
          description: "Old car has been parked in the same spot for months, appears abandoned.",
          category: "Other",
          status: "Open",
          distance: "3.9 km",
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "2 weeks ago"
        },
        {
          id: 17,
          title: "Overgrown vegetation blocking sign",
          description: "Bushes have grown to block important traffic sign at intersection.",
          category: "Public Safety",
          status: "Resolved",
          distance: "2.2 km",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "1 month ago"
        },
        {
          id: 18,
          title: "Broken fire hydrant",
          description: "Fire hydrant damaged in accident, water continuously leaking onto street.",
          category: "Water & Sanitation",
          status: "In Progress",
          distance: "1.8 km",
          image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=200&fit=crop&crop=entropy&auto=format",
          reportedDate: "12 hours ago"
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const convertedUserReports: Issue[] = userReports.map(report => ({
        id: report.id,
        title: report.title,
        description: report.description,
        category: report.category,
        status: report.status === 'pending' ? 'Open' : 
                report.status === 'in-progress' ? 'In Progress' : 
                report.status === 'resolved' ? 'Resolved' : 'Closed',
        location: report.location,
        images: report.images,
        image: report.images[0],
        submittedAt: report.submittedAt,
        updatedAt: report.updatedAt,
        submittedBy: report.submittedBy,
        isAnonymous: report.isAnonymous,
        votes: Math.floor(Math.random() * 15) + 1,
        priority: 'medium' as const,
        distance: '0.2 km',
        reportedDate: new Date(report.submittedAt).toLocaleDateString() === new Date().toLocaleDateString() 
          ? 'Today' 
          : `${Math.ceil((Date.now() - new Date(report.submittedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago`
      }));

      const allIssues = [...convertedUserReports, ...sampleIssues];
      const filteredByLocation = filterIssuesByLocation(allIssues);
      setIssues(filteredByLocation);
    } catch (err) {
      setError('Failed to fetch issues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [isLoggedIn, location.state, userReports]);

  const filterIssues = (): Issue[] => {
    return issues.filter(issue => {
      const matchesCategory = !filters.category || issue.category === filters.category;
      const matchesStatus = !filters.status || issue.status === filters.status;
      const matchesDistance = !filters.distance || issue.distance.includes(filters.distance.split(' ')[1]);
      const matchesSearch = !searchQuery || 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesDistance && matchesSearch;
    });
  };

  const getPaginatedIssues = (filteredIssues: Issue[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredIssues.slice(startIndex, endIndex);
  };

  const getTotalPages = (filteredIssues: Issue[]) => {
    return Math.ceil(filteredIssues.length / itemsPerPage);
  };

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      distance: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleIssueClick = (issue: Issue) => {
    openModal(issue);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              i === currentPage
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            1 === currentPage
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="px-2 py-2 text-sm text-slate-400">
            ...
          </span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              i === currentPage
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-2 py-2 text-sm text-slate-400">
            ...
          </span>
        );
      }

      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              totalPages === currentPage
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  const filteredIssues = filterIssues();
  const totalPages = getTotalPages(filteredIssues);
  const paginatedIssues = getPaginatedIssues(filteredIssues);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchIssues}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          {isLoggedIn 
            ? `Welcome back, ${user?.name || 'User'}!` 
            : 'Community Issues Dashboard'
          }
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {isLoggedIn
            ? `Track and resolve civic issues in your area. ${userLocation ? 'Issues are filtered based on your location.' : 'Enable location access for personalized issue tracking.'}`
            : 'Discover civic issues in the community. Sign in to see issues relevant to your location and participate in solutions.'
          }
        </p>
        {isLoggedIn && !userLocation && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg inline-block">
            <div className="flex items-center space-x-2 text-amber-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Location access not available. Showing all community issues.
              </span>
            </div>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-700 transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'All Categories' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-700 transition-all duration-200"
              >
                {statuses.map((status) => (
                  <option key={status} value={status === 'All Status' ? '' : status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Distance
              </label>
              <select
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-700 transition-all duration-200"
              >
                {distances.map((distance) => (
                  <option key={distance} value={distance === 'All Distances' ? '' : distance}>
                    {distance}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[400px]">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-slate-700 placeholder-slate-400 transition-all duration-200"
              />
            </div>

            <button
              onClick={clearFilters}
              className="px-6 py-3 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all duration-200 whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>

        {(filters.category || filters.status || filters.distance || searchQuery) && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-slate-700">Active filters:</span>
              {filters.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {filters.status}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.distance && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Distance: {filters.distance}
                  <button
                    onClick={() => handleFilterChange('distance', '')}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="text-center text-slate-500">
            {isLoggedIn && !searchQuery && !filters.category && !filters.status && !filters.distance ? (
              <>
                <div className="text-6xl mb-4">😊</div>
                <h3 className="text-xl font-medium text-slate-800 mb-2">No Issues Nearby!</h3>
                <p className="text-slate-600 mb-4">
                  Great news! There are currently no reported issues in your area. Your community is doing well!
                </p>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    🎉 Your neighborhood is issue-free. Keep up the great community spirit!
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No Issues Found</h3>
                <p className="text-slate-600 mb-4">
                  {searchQuery || filters.category || filters.status || filters.distance
                    ? "Try adjusting your filters or search terms to find issues."
                    : "There are currently no reported issues. This is great news for the community!"}
                </p>
                {!isLoggedIn && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Sign in to see issues specific to your location and participate in community solutions.
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Sign In
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredIssues.length)} of {filteredIssues.length} issues
            </div>
            <div className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedIssues.map((issue) => (
              <Card
                key={issue.id}
                card={issue}
                onClick={handleIssueClick}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-8 space-y-4">
              <div className="flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm p-2">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <div className="flex items-center space-x-1 mx-2">
                    {renderPaginationButtons()}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-500">
                Page {currentPage} of {totalPages} • {filteredIssues.length} total issues
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex gap-6">
        <div className="hidden lg:block w-80 flex-shrink-0">
          <RecentCards limit={3} />
        </div>

        <div className="flex-1">
          <Modal />
        </div>
      </div>
    </div>
  );
};

export default Home;
