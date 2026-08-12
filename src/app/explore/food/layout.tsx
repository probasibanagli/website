import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bengali Food & Restaurants in Tamil Nadu | ProbasiBangali',
  description: 'Discover authentic Bengali restaurants, sweet shops, tiffin services, and delivery partners in Chennai, Coimbatore & Vellore. Zomato & Swiggy links included.',
  keywords: ['Bengali food Chennai', 'Bengali restaurant Tamil Nadu', 'Bengali sweets Chennai', 'Kolkata food in Chennai'],
};

export default function FoodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
