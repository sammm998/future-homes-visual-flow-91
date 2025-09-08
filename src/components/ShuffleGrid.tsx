"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const shuffle = (array: (typeof propertyData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};
const propertyData = [{
  id: 1,
  src: "/lovable-uploads/000f440d-ddb1-4c1b-9202-eef1ef588a8c.png"
}, {
  id: 2,
  src: "/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png"
}, {
  id: 3,
  src: "/lovable-uploads/0ecd2ba5-fc2d-42db-8052-d51cffc0b438.png"
}, {
  id: 4,
  src: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.png"
}, {
  id: 5,
  src: "/lovable-uploads/35d77b72-fddb-4174-b101-7f0dd0f3385d.png"
}, {
  id: 6,
  src: "/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png"
}, {
  id: 7,
  src: "/lovable-uploads/37669c23-a476-4550-84f1-f370ce4333a1.png"
}, {
  id: 8,
  src: "/lovable-uploads/4d9ff093-d8bd-4855-80db-6c58534a8e44.png"
}, {
  id: 9,
  src: "/lovable-uploads/57965b04-af07-45ca-8bb7-9dec10da9d29.png"
}, {
  id: 10,
  src: "/lovable-uploads/5daee4c4-d9d3-41c2-99bc-382e40915f52.png"
}, {
  id: 11,
  src: "/lovable-uploads/aff7bebd-5943-45d9-84d8-a923abf07e24.png"
}, {
  id: 12,
  src: "/lovable-uploads/ae81b7b2-74ce-4693-b5bf-43a5e3bb2b97.png"
}, {
  id: 13,
  src: "/lovable-uploads/86a8042b-af76-4da8-8aeb-218ab9c24059.png"
}, {
  id: 14,
  src: "/lovable-uploads/9537b0b1-89b0-4c63-ae02-494c98caab5d.png"
}, {
  id: 15,
  src: "/lovable-uploads/bfe83af6-39c4-4a52-b4e4-82ff091c5f48.png"
}, {
  id: 16,
  src: "/lovable-uploads/c869b6e7-1d37-47cf-9558-55aa3d03053e.png"
}];
const generateSquares = () => {
  return shuffle(propertyData).map(sq => {});
};
const ShuffleGridComponent = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState(generateSquares());
  useEffect(() => {
    shuffleSquares();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const shuffleSquares = () => {
    setSquares(generateSquares());

    // Shuffling disabled for performance
    // timeoutRef.current = setTimeout(shuffleSquares, 25000);
  };
  return;
};
const ShuffleGrid = () => {
  return <ShuffleGridComponent />;
};
export default memo(ShuffleGrid);