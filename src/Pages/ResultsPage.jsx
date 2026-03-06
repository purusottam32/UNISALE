// src/pages/ResultsPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Simple mock data (replace with real API)
// Images use Unsplash source links (keyword-based) so you get relevant preview images.
const mockProducts = [
  // Books
 {
    id: "p1",
    title: "Calculus Textbook (3rd Year) - Thomas",
    category: "books",
    brief: "University calculus textbook, good condition",
    images: ["https://images.unsplash.com/photo-1714146681247-a5e3a5fad6b5?q=80&w=1346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "8 months",
    condition: "Good",
    seller: { name: "Ravi", campus: "SOA Campus", rating: 4.8 },
    price: 250,
    postedAt: "2 days ago",
  },
  {
    id: "p2-books",
    title: "Physics (Part 1 & 2) - HC Verma",
    category: "books",
    brief: "Physics standard reference, minimal marking",
    images: ["https://images.unsplash.com/photo-1714146681247-a5e3a5fad6b5?q=80&w=1346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "1 year",
    condition: "Excellent",
    seller: { name: "Priya", campus: "KIIT", rating: 4.9 },
    price: 300,
    postedAt: "3 days ago",
  },
  {
    id: "p3-books",
    title: "Organic Chemistry - Morrison & Boyd",
    category: "books",
    brief: "Complete reference for organic chemistry",
    images: ["https://images.unsplash.com/photo-1714146681247-a5e3a5fad6b5?q=80&w=1346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "6 months",
    condition: "Good",
    seller: { name: "Akshay", campus: "NIT Rourkela", rating: 4.7 },
    price: 280,
    postedAt: "1 day ago",
  },
  {
    id: "p4-books",
    title: "Programming in C - Dennis Ritchie",
    category: "books",
    brief: "Classic C programming reference",
    images: ["https://images.unsplash.com/photo-1714146681247-a5e3a5fad6b5?q=80&w=1346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "1 year",
    condition: "Good",
    seller: { name: "Nikhil", campus: "SOA Campus", rating: 4.6 },
    price: 220,
    postedAt: "4 days ago",
  },
  {
    id: "p5-books",
    title: "Data Structures - Cormen",
    category: "books",
    brief: "Introduction to algorithms & data structures",
    images: ["https://images.unsplash.com/photo-1714146681247-a5e3a5fad6b5?q=80&w=1346&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "2 months",
    condition: "Like New",
    seller: { name: "Shreya", campus: "KIIT", rating: 5.0 },
    price: 350,
    postedAt: "1 day ago",
  },

  // Electronics
  {
    id: "p6",
    title: "MacBook Air 2017 - Light usage",
    category: "electronics",
    brief: "8GB RAM, 256GB SSD, battery ok",
    images: ["https://source.unsplash.com/800x800/?macbook,laptop,apple"],
    usedDuration: "2 years",
    condition: "Fair",
    seller: { name: "Anjali", campus: "SOA Hostel", rating: 4.6 },
    price: 22000,
    postedAt: "5 days ago",
  },
  {
    id: "p7-electronics",
    title: "Dell XPS 13 - Almost New",
    category: "electronics",
    brief: "Core i5, 8GB RAM, 512GB SSD, purchased 1 month ago",
    images: ["https://source.unsplash.com/800x800/?dell,laptop,notebook"],
    usedDuration: "1 month",
    condition: "Like New",
    seller: { name: "Vikram", campus: "SOA Campus", rating: 4.9 },
    price: 45000,
    postedAt: "2 days ago",
  },
  {
    id: "p8-electronics",
    title: "iPad Pro 11-inch 2020 - Good condition",
    category: "electronics",
    brief: "64GB, WiFi + Cellular, with Apple Pencil",
    images: ["https://source.unsplash.com/800x800/?ipad,tablet,apple"],
    usedDuration: "1 year",
    condition: "Good",
    seller: { name: "Maya", campus: "KIIT", rating: 4.8 },
    price: 28000,
    postedAt: "3 days ago",
  },
  {
    id: "p9-electronics",
    title: "Sony WH-1000XM4 Headphones",
    category: "electronics",
    brief: "Noise-cancelling Bluetooth headphones, rarely used",
    images: ["https://source.unsplash.com/800x800/?headphones,sony,audio"],
    usedDuration: "3 months",
    condition: "Like New",
    seller: { name: "Arjun", campus: "NIT Rourkela", rating: 4.7 },
    price: 18000,
    postedAt: "2 days ago",
  },
  {
    id: "p10-electronics",
    title: "Samsung 27\" 144Hz Gaming Monitor",
    category: "electronics",
    brief: "Perfect for gaming and work, comes with stand",
    images: ["https://source.unsplash.com/800x800/?monitor,screen,gaming"],
    usedDuration: "6 months",
    condition: "Good",
    seller: { name: "Rohan", campus: "SOA Campus", rating: 4.5 },
    price: 15000,
    postedAt: "4 days ago",
  },

  // Furniture
  {
    id: "p11",
    title: "Wooden Study Desk - Spacious",
    category: "furniture",
    brief: "3ft x 2ft study desk, solid wood, good for hostel",
    images: ["https://source.unsplash.com/800x800/?wooden,desk,study"],
    usedDuration: "1 year",
    condition: "Good",
    seller: { name: "Suresh", campus: "SOA Hostel", rating: 4.7 },
    price: 2500,
    postedAt: "6 days ago",
  },
  {
    id: "p12-furniture",
    title: "Single Bed with Mattress",
    category: "furniture",
    brief: "Metal frame bed with foam mattress, barely used",
    images: ["https://source.unsplash.com/800x800/?bed,mattress,bedroom"],
    usedDuration: "3 months",
    condition: "Excellent",
    seller: { name: "Divya", campus: "KIIT", rating: 4.9 },
    price: 4500,
    postedAt: "3 days ago",
  },
  {
    id: "p13-furniture",
    title: "Office Chair - Ergonomic",
    category: "furniture",
    brief: "Adjustable height, lumbar support, perfect condition",
    images: ["https://source.unsplash.com/800x800/?office,chair,ergonomic"],
    usedDuration: "4 months",
    condition: "Like New",
    seller: { name: "Karan", campus: "SOA Campus", rating: 4.8 },
    price: 3500,
    postedAt: "2 days ago",
  },
  {
    id: "p14-furniture",
    title: "Bookshelf (5-tier) - Wooden",
    category: "furniture",
    brief: "Perfect for organizing textbooks and items",
    images: ["https://source.unsplash.com/800x800/?bookshelf,books,storage"],
    usedDuration: "2 years",
    condition: "Good",
    seller: { name: "Pallavi", campus: "NIT Rourkela", rating: 4.6 },
    price: 1800,
    postedAt: "5 days ago",
  },
  {
    id: "p15-furniture",
    title: "Standing Desk Converter",
    category: "furniture",
    brief: "Adjustable height desk converter, dual monitor compatible",
    images: ["https://source.unsplash.com/800x800/?standing,desk,workstation"],
    usedDuration: "6 months",
    condition: "Good",
    seller: { name: "Harsh", campus: "SOA Campus", rating: 4.7 },
    price: 3200,
    postedAt: "4 days ago",
  },

  // Bikes
  // NOTE: the following `images` entries use an Unsplash page URL provided by the user.
  // Unsplash page URLs may not be direct image files — consider replacing with
  // a direct image URL or `source.unsplash.com` if the image doesn't render.
  {
    id: "p16",
    title: "Mountain Bike - Trek X-Caliber",
    category: "bikes",
    brief: "27-speed, 26\" wheels, excellent for trails",
    images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "1 year",
    condition: "Good",
    seller: { name: "Arjun", campus: "SOA Campus", rating: 4.8 },
    price: 8000,
    postedAt: "3 days ago",
  },
  {
    id: "p17-bikes",
    title: "Road Bike - Hero Octane",
    category: "bikes",
    brief: "Lightweight, 18-speed, perfect for city commute",
    images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "8 months",
    condition: "Excellent",
    seller: { name: "Siddharth", campus: "KIIT", rating: 4.9 },
    price: 5500,
    postedAt: "2 days ago",
  },
  {
    id: "p18-bikes",
    title: "BMX Bike - Freestyle",
    category: "bikes",
    brief: "Stunt bike, 20\" wheels, great condition",
    images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "6 months",
    condition: "Good",
    seller: { name: "Rajesh", campus: "NIT Rourkela", rating: 4.7 },
    price: 3500,
    postedAt: "5 days ago",
  },
  {
    id: "p19-bikes",
    title: "Hybrid Bike - Decathlon",
    category: "bikes",
    brief: "Versatile for road and light trails, 21-speed",
    images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "4 months",
    condition: "Like New",
    seller: { name: "Neha", campus: "SOA Campus", rating: 4.8 },
    price: 6500,
    postedAt: "1 day ago",
  },
  {
    id: "p20-bikes",
    title: "Electric Bike - Pedego",
    category: "bikes",
    brief: "E-bike, 50km range, perfect for campus travel",
    images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    usedDuration: "2 months",
    condition: "Excellent",
    seller: { name: "Varun", campus: "KIIT", rating: 5.0 },
    price: 25000,
    postedAt: "3 days ago",
  },

  // Notes
  {
    id: "p21",
    title: "Organic Chemistry Complete Notes - Handwritten",
    category: "notes",
    brief: "Comprehensive handwritten notes, well-organized",
    images: ["https://source.unsplash.com/800x800/?handwritten,notes,study"],
    usedDuration: "1 semester",
    condition: "Like New",
    seller: { name: "Isha", campus: "SOA Campus", rating: 4.9 },
    price: 150,
    postedAt: "2 days ago",
  },
  {
    id: "p22-notes",
    title: "Physics Class Notes (Mechanics + Thermodynamics)",
    category: "notes",
    brief: "Detailed notes with diagrams and formulas",
    images: ["https://source.unsplash.com/800x800/?physics,notes,study"],
    usedDuration: "1 semester",
    condition: "Good",
    seller: { name: "Mohit", campus: "NIT Rourkela", rating: 4.8 },
    price: 120,
    postedAt: "4 days ago",
  },
  {
    id: "p23-notes",
    title: "Mathematics - Calculus & Linear Algebra Notes",
    category: "notes",
    brief: "Typed notes with solved examples",
    images: ["https://source.unsplash.com/800x800/?math,notes,calculus"],
    usedDuration: "1 semester",
    condition: "Excellent",
    seller: { name: "Anjali", campus: "KIIT", rating: 4.9 },
    price: 180,
    postedAt: "1 day ago",
  },
  {
    id: "p24-notes",
    title: "Data Structures & Algorithms - Digital Notes",
    category: "notes",
    brief: "PDF notes with code snippets and explanations",
    images: ["https://source.unsplash.com/800x800/?programming,notes,code"],
    usedDuration: "2 weeks",
    condition: "Like New",
    seller: { name: "Vipul", campus: "SOA Campus", rating: 4.7 },
    price: 200,
    postedAt: "1 day ago",
  },
  {
    id: "p25-notes",
    title: "Economics Micro & Macroeconomics Notes",
    category: "notes",
    brief: "Complete semester notes with case studies",
    images: ["https://source.unsplash.com/800x800/?economics,notes,books"],
    usedDuration: "1 semester",
    condition: "Good",
    seller: { name: "Priya", campus: "KIIT", rating: 4.8 },
    price: 130,
    postedAt: "3 days ago",
  },
];

export default function ResultsPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const q = query.get("q") || "";
  const cat = (query.get("cat") || "").toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        // Try real API first
        const res = await fetch(`/api/products?${new URLSearchParams({ q, cat })}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          // fallback to mock
          setProducts(filterLocal(mockProducts, q, cat));
        }
      } catch (err) {
        // offline / dev fallback
        setProducts(filterLocal(mockProducts, q, cat));
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [q, cat]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Results</h2>
        <div className="text-sm text-gray-600">Showing results for <span className="font-medium">{q || cat || "all items"}</span></div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex flex-wrap gap-2">
          {/* quick filter chips */}
          {["books","electronics","furniture","bikes","notes"].map(c => (
            <button
              key={c}
              onClick={() => navigate(`/results?cat=${c}`)}
              className={`px-3 py-1 rounded-full text-sm ${cat === c ? "bg-green-500 text-white" : "bg-gray-100"}`}
            >
              {c[0].toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="min-w-[180px] text-sm text-gray-600">Sort:
          {/* basic sort placeholder */}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No results found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* pagination could be added here */}
    </div>
  );
}

function filterLocal(list, q, cat) {
  const term = (q || "").trim().toLowerCase();
  return list.filter(item => {
    if (cat && item.category?.toLowerCase() !== cat) return false;
    if (!term) return true;
    return (
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.brief && item.brief.toLowerCase().includes(term)) ||
      (item.seller?.name && item.seller.name.toLowerCase().includes(term))
    );
  });
}
