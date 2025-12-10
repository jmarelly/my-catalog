import { v4 as uuidv4 } from "uuid";
import { db } from "../src/database/index";
import { categories } from "../src/api/categories/category.schema";
import { products } from "../src/api/products/product.schema";
import { userService } from "../src/container";
import { logger } from "../src/utils/logger";

const defaultCategories = [
  { name: "electronics", description: "Electronic devices and gadgets" },
  { name: "clothing", description: "Apparel and fashion items" },
  { name: "books", description: "Books and publications" },
  { name: "home & garden", description: "Home decor and garden supplies" },
  {
    name: "sports & outdoors",
    description: "Sports equipment and outdoor gear",
  },
  { name: "toys & games", description: "Toys, games, and entertainment" },
  { name: "beauty & health", description: "Beauty products and health items" },
  { name: "food & beverages", description: "Food items and drinks" },
];

const productNames: Record<string, string[]> = {
  electronics: [
    "Wireless Bluetooth Headphones",
    "Smart Watch Pro",
    "Portable Power Bank 20000mAh",
    "USB-C Hub Adapter",
    "Mechanical Gaming Keyboard",
    "4K Webcam HD",
    "Noise Cancelling Earbuds",
    "Smart Home Speaker",
    "Wireless Charging Pad",
    "Portable SSD 1TB",
    "Gaming Mouse RGB",
    "Monitor Stand with USB",
  ],
  clothing: [
    "Classic Cotton T-Shirt",
    "Slim Fit Jeans",
    "Hooded Sweatshirt",
    "Running Sneakers",
    "Leather Belt",
    "Winter Jacket",
    "Casual Polo Shirt",
    "Sports Shorts",
    "Wool Sweater",
    "Canvas Backpack",
    "Denim Jacket",
    "Formal Dress Shirt",
  ],
  books: [
    "JavaScript: The Good Parts",
    "Clean Code Handbook",
    "Design Patterns Explained",
    "The Pragmatic Programmer",
    "Introduction to Algorithms",
    "System Design Interview",
    "Docker Deep Dive",
    "Learning React",
    "Node.js in Action",
    "Python Crash Course",
    "Database Internals",
    "Building Microservices",
  ],
  "home & garden": [
    "Stainless Steel Cookware Set",
    "Memory Foam Pillow",
    "LED Desk Lamp",
    "Robot Vacuum Cleaner",
    "Air Purifier HEPA",
    "Coffee Maker Programmable",
    "Bamboo Cutting Board",
    "Storage Container Set",
    "Electric Kettle",
    "Bedside Table Lamp",
    "Wall Clock Modern",
    "Plant Pot Set",
  ],
  "sports & outdoors": [
    "Yoga Mat Premium",
    "Resistance Bands Set",
    "Foam Roller",
    "Jump Rope Speed",
    "Dumbbell Set Adjustable",
    "Exercise Ball",
    "Running Armband",
    "Cycling Gloves",
    "Sports Water Bottle",
    "Tennis Racket",
    "Basketball Indoor/Outdoor",
    "Hiking Backpack 40L",
  ],
  "toys & games": [
    "Building Blocks 500pcs",
    "Remote Control Car",
    "Board Game Collection",
    "Puzzle 1000 Pieces",
    "Action Figure Set",
    "Educational STEM Kit",
    "Drone Mini",
    "Card Game Pack",
    "Plush Toy Large",
    "Art Supply Set",
    "Magic Kit",
    "Science Experiment Kit",
  ],
  "beauty & health": [
    "Vitamin C Serum",
    "Moisturizing Face Cream",
    "Sunscreen SPF 50",
    "Hair Dryer Professional",
    "Electric Toothbrush",
    "Perfume Eau de Parfum",
    "Makeup Brush Set",
    "Face Mask Sheet Pack",
    "Nail Polish Collection",
    "Beard Trimmer",
    "Body Lotion",
    "Shampoo & Conditioner Set",
  ],
  "food & beverages": [
    "Organic Coffee Beans 1kg",
    "Green Tea Collection",
    "Dark Chocolate Assortment",
    "Protein Bars Pack",
    "Mixed Nuts Premium",
    "Olive Oil Extra Virgin",
    "Honey Raw Organic",
    "Dried Fruit Mix",
    "Energy Drink Pack",
    "Gourmet Spice Set",
    "Granola Mix",
    "Coconut Water Pack",
  ],
};

const productDescriptions = [
  "High-quality product with premium materials and excellent craftsmanship.",
  "Feature-packed item designed for everyday use and durability.",
  "Modern design that combines style with functionality.",
  "Perfect choice for those who value quality and performance.",
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(): number {
  const price = Math.random() * 490 + 10;
  return Math.round(price * 100) / 100;
}

export async function seedAdminUser(): Promise<void> {
  const existingAdmin = await userService.getUserByUsername("admin");
  if (existingAdmin) {
    logger.debug("👤 Admin user already exists");
    return;
  }

  await userService.createUser({
    username: "admin",
    password: "admin123",
    role: "admin",
  });
  logger.info({ username: "admin" }, "👤 Admin user created");
}

export function seedCategories(): Map<string, string> {
  const categoryMap = new Map<string, string>();

  const existingCategories = db.select().from(categories).all();
  if (existingCategories.length > 0) {
    existingCategories.forEach((c) => categoryMap.set(c.name, c.id));
    logger.debug(
      { count: existingCategories.length },
      "🏷️  Categories already exist"
    );
    return categoryMap;
  }

  for (const cat of defaultCategories) {
    const id = uuidv4();
    db.insert(categories)
      .values({
        id,
        name: cat.name,
        description: cat.description,
      })
      .run();
    categoryMap.set(cat.name, id);
  }

  logger.info({ count: categoryMap.size }, "🏷️  Categories created");
  return categoryMap;
}

export function seedProducts(count: number = 75): void {
  const existingCount = db
    .select({ count: products.id })
    .from(products)
    .all().length;
  if (existingCount > 0) {
    logger.debug({ count: existingCount }, "📦 Products already exist");
    return;
  }

  const categoryMap = seedCategories();
  const categoryNames = Array.from(categoryMap.keys());

  for (let i = 0; i < count; i++) {
    const categoryName = categoryNames[i % categoryNames.length];
    const categoryId = categoryMap.get(categoryName)!;
    const names = productNames[categoryName] || [];

    const baseName = getRandomElement(names);
    const nameSuffix = Math.floor(i / categoryNames.length) + 1;
    const name = nameSuffix > 1 ? `${baseName} v${nameSuffix}` : baseName;

    db.insert(products)
      .values({
        id: uuidv4(),
        name,
        price: getRandomPrice(),
        categoryId,
        description: getRandomElement(productDescriptions),
      })
      .run();
  }

  logger.info({ count }, "📦 Products created");
}

export async function seedAll(): Promise<void> {
  logger.info("🌱 Seeding database...");
  await seedAdminUser();
  seedCategories();
  seedProducts(75);
  logger.info("✨ Database seeding complete");
}
