import imgGown from "../assets/product-gown.jpg";
import imgLehenga from "../assets/product-lehenga.jpg";
import imgSaree from "../assets/product-saree.jpg";
import imgSherwani from "../assets/product-sherwani.jpg";
import imgTuxedo from "../assets/product-tuxedo.jpg";
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  designerName: string;
  categoryId?: string;
  pricePerDay: number;
  depositAmount: number;
  sizes: string[];
  colors: string[];
  occasions: string[];
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export const categories: Category[] = [
  {
    id: "lehenga",
    name: "Lehenga",
    description: "Bridal & festive lehengas for every occasion",
    icon: "👗",
    color: "from-rose-100 to-pink-200",
  },
  {
    id: "gowns",
    name: "Gowns",
    description: "Elegant evening & ball gowns",
    icon: "✨",
    color: "from-blue-100 to-indigo-200",
  },
  {
    id: "sherwani",
    name: "Sherwani",
    description: "Royal sherwanis for grooms & weddings",
    icon: "🤵",
    color: "from-amber-100 to-yellow-200",
  },
  {
    id: "tuxedos",
    name: "Tuxedos",
    description: "Classic tuxedos for formal events",
    icon: "🎩",
    color: "from-slate-100 to-gray-200",
  },
  {
    id: "suits",
    name: "Suits",
    description: "Premium suits for all formal occasions",
    icon: "👔",
    color: "from-teal-100 to-emerald-200",
  },
  {
    id: "sarees",
    name: "Sarees",
    description: "Traditional & designer sarees",
    icon: "🌺",
    color: "from-purple-100 to-violet-200",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Crimson Bridal Lehenga",
    designerName: "Manish Malhotra",
    categoryId: "lehenga",
    pricePerDay: 2500,
    depositAmount: 10000,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red", "Maroon"],
    occasions: ["Wedding", "Engagement"],
    description:
      "Exquisite crimson bridal lehenga with intricate zari embroidery and heavy dupatta. Perfect for your special day.",
    images: [imgLehenga],
    rating: 4.8,
    reviewCount: 124,
    isAvailable: true,
  },
  {
    id: "p2",
    name: "Sapphire Evening Gown",
    designerName: "Sabyasachi",
    categoryId: "gowns",
    pricePerDay: 1800,
    depositAmount: 7000,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Navy Blue", "Royal Blue"],
    occasions: ["Party", "Formal", "Award Night"],
    description:
      "Stunning floor-length sapphire evening gown with sequin embellishments. Make a statement at any formal event.",
    images: [imgGown],
    rating: 4.7,
    reviewCount: 89,
    isAvailable: true,
  },
  {
    id: "p3",
    name: "Royal Ivory Sherwani",
    designerName: "Tarun Tahiliani",
    categoryId: "sherwani",
    pricePerDay: 2200,
    depositAmount: 9000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Ivory", "Cream", "Off White"],
    occasions: ["Wedding", "Engagement", "Sangeet"],
    description:
      "Magnificent ivory sherwani with gold threadwork embroidery. Regal attire fit for a king on his wedding day.",
    images: [imgSherwani],
    rating: 4.9,
    reviewCount: 156,
    isAvailable: true,
  },
  {
    id: "p4",
    name: "Classic Black Tuxedo",
    designerName: "Raymond",
    categoryId: "tuxedos",
    pricePerDay: 1500,
    depositAmount: 6000,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    occasions: ["Formal", "Party", "Corporate"],
    description:
      "Timeless black tuxedo with satin lapels and matching trousers. The epitome of formal elegance.",
    images: [imgTuxedo],
    rating: 4.6,
    reviewCount: 78,
    isAvailable: true,
  },
  {
    id: "p5",
    name: "Magenta Silk Saree",
    designerName: "Ritu Kumar",
    categoryId: "sarees",
    pricePerDay: 1200,
    depositAmount: 5000,
    sizes: ["Free Size"],
    colors: ["Magenta", "Pink"],
    occasions: ["Festival", "Wedding", "Party"],
    description:
      "Luxurious magenta silk saree with golden zari border. Draped elegance for festive occasions.",
    images: [imgSaree],
    rating: 4.5,
    reviewCount: 92,
    isAvailable: true,
  },
  {
    id: "p6",
    name: "Emerald Designer Lehenga",
    designerName: "Anita Dongre",
    categoryId: "lehenga",
    pricePerDay: 2000,
    depositAmount: 8000,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Emerald Green", "Teal"],
    occasions: ["Wedding", "Festival", "Mehndi"],
    description:
      "Breathtaking emerald green lehenga with floral embroidery and mirror work. A festive delight.",
    images: [imgLehenga],
    rating: 4.7,
    reviewCount: 67,
    isAvailable: true,
  },
  {
    id: "p7",
    name: "Rose Gold Evening Gown",
    designerName: "Manish Malhotra",
    categoryId: "gowns",
    pricePerDay: 2200,
    depositAmount: 8500,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Rose Gold", "Champagne"],
    occasions: ["Party", "Formal", "Cocktail"],
    description:
      "Glamorous rose gold gown with beaded bodice and flowing skirt. Perfect for cocktail parties and formal events.",
    images: [imgGown],
    rating: 4.8,
    reviewCount: 103,
    isAvailable: true,
  },
  {
    id: "p8",
    name: "Navy Blue Bandhgala Suit",
    designerName: "Peter England",
    categoryId: "suits",
    pricePerDay: 1300,
    depositAmount: 5500,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue"],
    occasions: ["Formal", "Corporate", "Wedding"],
    description:
      "Sharp navy blue bandhgala suit with subtle textured fabric. Combines traditional and contemporary aesthetics.",
    images: [imgTuxedo],
    rating: 4.4,
    reviewCount: 45,
    isAvailable: true,
  },
  {
    id: "p9",
    name: "Golden Banarasi Saree",
    designerName: "Sabyasachi",
    categoryId: "sarees",
    pricePerDay: 1800,
    depositAmount: 7500,
    sizes: ["Free Size"],
    colors: ["Gold", "Beige"],
    occasions: ["Wedding", "Festival", "Puja"],
    description:
      "Authentic Banarasi silk saree with heavy gold zari weave. A timeless heirloom piece for special occasions.",
    images: [imgSaree],
    rating: 4.9,
    reviewCount: 201,
    isAvailable: true,
  },
  {
    id: "p10",
    name: "Navy Sherwani with Jodhpuri",
    designerName: "Rohit Bal",
    categoryId: "sherwani",
    pricePerDay: 1900,
    depositAmount: 7800,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Navy Blue", "Dark Blue"],
    occasions: ["Wedding", "Formal", "Festive"],
    description:
      "Sophisticated navy sherwani paired with matching jodhpuri pants. Ideal for the modern groom.",
    images: [imgSherwani],
    rating: 4.6,
    reviewCount: 58,
    isAvailable: true,
  },
  {
    id: "p11",
    name: "White Slim Fit Tuxedo",
    designerName: "Van Heusen",
    categoryId: "tuxedos",
    pricePerDay: 1600,
    depositAmount: 6500,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Off White"],
    occasions: ["Wedding", "Party", "Formal"],
    description:
      "Modern white slim-fit tuxedo for grooms who want a contemporary look. Complete with black bow tie.",
    images: [imgTuxedo],
    rating: 4.5,
    reviewCount: 63,
    isAvailable: true,
  },
  {
    id: "p12",
    name: "Peach Anarkali Suit",
    designerName: "Ritu Kumar",
    categoryId: "suits",
    pricePerDay: 900,
    depositAmount: 3500,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Peach", "Blush Pink"],
    occasions: ["Festival", "Party", "Eid"],
    description:
      "Flowy peach anarkali suit with delicate thread embroidery. Light and elegant for festive celebrations.",
    images: [imgLehenga],
    rating: 4.3,
    reviewCount: 37,
    isAvailable: true,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    userName: "Priya Sharma",
    rating: 5,
    comment:
      "Absolutely stunning lehenga! Received so many compliments at my sister's wedding.",
    date: "2024-02-15",
    avatar: "PS",
  },
  {
    id: "r2",
    productId: "p2",
    userName: "Ananya Gupta",
    rating: 5,
    comment:
      "The gown was even more beautiful in person. Perfect fit and delivery was on time!",
    date: "2024-01-20",
    avatar: "AG",
  },
  {
    id: "r3",
    productId: "p3",
    userName: "Rahul Mehta",
    rating: 5,
    comment:
      "Wore this for my wedding and felt like royalty. Excellent quality and service.",
    date: "2024-03-05",
    avatar: "RM",
  },
  {
    id: "r4",
    productId: "p1",
    userName: "Deepika Patel",
    rating: 4,
    comment:
      "Beautiful outfit. Slightly large but the team helped with alteration. Worth every penny!",
    date: "2024-02-28",
    avatar: "DP",
  },
  {
    id: "r5",
    productId: "p5",
    userName: "Sunita Verma",
    rating: 5,
    comment:
      "The saree quality is exceptional. Exactly as shown in the pictures. Will definitely rent again!",
    date: "2024-01-10",
    avatar: "SV",
  },
];

export const testimonials = [
  {
    name: "Meera Joshi",
    role: "Bride",
    comment:
      "Radhey Radhey Unique Collection made my wedding perfect! The lehenga was breathtaking and saved us thousands. Highly recommend!",
    rating: 5,
    avatar: "MJ",
  },
  {
    name: "Arjun Singh",
    role: "Groom",
    comment:
      "Found the perfect sherwani for my big day. The quality was exceptional and the team was incredibly helpful.",
    rating: 5,
    avatar: "AS",
  },
  {
    name: "Kavya Reddy",
    role: "Event Guest",
    comment:
      "Rented a gorgeous gown for my friend's wedding reception. Felt like a celebrity for a fraction of the price!",
    rating: 5,
    avatar: "KR",
  },
];
