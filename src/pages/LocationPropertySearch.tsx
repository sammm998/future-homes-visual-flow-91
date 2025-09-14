import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AllPropertiesSearch from "./AllPropertiesSearch";

const LocationPropertySearch: React.FC = () => {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  useEffect(() => {
    // Extract location from pathname
    const pathname = currentLocation.pathname;
    const locationMap: { [key: string]: string } = {
      '/antalya': 'Antalya',
      '/dubai': 'Dubai',
      '/cyprus': 'Cyprus',
      '/mersin': 'Mersin',
      '/bali': 'Bali'
    };

    const location = locationMap[pathname];
    if (location) {
      // Redirect to /properties with location filter
      const searchParams = new URLSearchParams(currentLocation.search);
      searchParams.set('location', location);
      navigate(`/properties?${searchParams.toString()}`, { replace: true });
    }
  }, [navigate, currentLocation.pathname, currentLocation.search]);

  // Render AllPropertiesSearch while redirecting
  return <AllPropertiesSearch />;
};

export default LocationPropertySearch;