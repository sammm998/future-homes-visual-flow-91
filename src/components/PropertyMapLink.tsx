import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, Search } from 'lucide-react';

const PropertyMapLink: React.FC = () => {
  return (
    <Link to="/map-search">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <Map className="h-4 w-4" />
        <Search className="h-4 w-4" />
        Map Search
      </Button>
    </Link>
  );
};

export default PropertyMapLink;