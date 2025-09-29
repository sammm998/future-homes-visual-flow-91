// Shared articles data for Information and Article components
import { FileText, Heart, CreditCard, Scale, Home, Users, DollarSign, Briefcase, Calculator, Building, Activity, Award, MapPin, Globe, Wifi, Camera, ShoppingCart, Utensils, Gamepad2, Palette, Clock, Zap, Trophy, ScrollText } from "lucide-react";

export interface Article {
  id: number;
  title: string;
  description: string;
  icon: any; // Use any for Lucide icon components
  image?: string;
  category: string;
  content: string;
}

export const articles: Article[] = [ 
  
];

export const getArticleById = (id: number): Article | undefined => {
  return articles.find(article => article.id === id);
};