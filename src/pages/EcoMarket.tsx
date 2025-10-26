// EcoMarket.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Leaf,
  Menu,
  X,
  ShoppingCart,
  Search,
  Filter,
  Heart,
  Star,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

/* ----------------------------- Types ---------------------------------- */
type Product = {
  id: string;
  title: string;
  price: number;
  rating: number; // 0-5
  category: string;
  img?: string;
  tags?: string[];
  description?: string;
  stock?: number;
};

type CartItem = {
  product: Product;
  qty: number;
};

/* ------------------------- Mock / Fetch Helpers ------------------------ */
// Replace this with your real API calls
async function fetchMockProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 350));
  return [
    {
      id: "p1",
      title: "Reusable Bamboo Bottle",
      price: 14.99,
      rating: 4.7,
      category: "Reusables",
      img: "/products/bottle.jpg",
      tags: ["bottle", "bamboo", "eco"],
      description: "Lightweight bamboo insulated bottle.",
      stock: 120,
    },
    {
      id: "p2",
      title: "Solar Lantern (Portable)",
      price: 34.5,
      rating: 4.5,
      category: "Energy",
      img: "/products/lantern.jpg",
      tags: ["solar", "lantern"],
      description: "Charge by sun, lasts 12 hours.",
      stock: 30,
    },
    {
      id: "p3",
      title: "Compostable Cutlery (24 pcs)",
      price: 7.9,
      rating: 4.2,
      category: "Kitchen",
      img: "/products/cutlery.jpg",
      tags: ["compost", "cutlery"],
      description: "Made from cornstarch — compostable.",
      stock: 200,
    },
    {
      id: "p4",
      title: "Organic Cotton Tote",
      price: 12.0,
      rating: 4.6,
      category: "Fashion",
      img: "/products/tote.jpg",
      tags: ["bag", "cotton"],
      description: "Durable everyday tote bag.",
      stock: 80,
    },
    {
      id: "p5",
      title: "Eco Snack Pack (Vegan)",
      price: 9.99,
      rating: 4.1,
      category: "Food",
      img: "/products/snack.jpg",
      tags: ["snack", "vegan"],
      description: "Healthy vegan snack pack.",
      stock: 50,
    },
    {
      id: "p6",
      title: "Home Energy Monitor (Plug)",
      price: 49.99,
      rating: 4.8,
      category: "Energy",
      img: "/products/monitor.jpg",
      tags: ["monitor", "energy"],
      description: "Track appliance energy use in realtime.",
      stock: 18,
    },
  ];
}

/* -------------------------- Shared UI Pieces --------------------------- */
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => (
  <button
    {...rest}
    className={`px-3 py-2 rounded-md font-semibold transition transform hover:scale-[1.02] bg-linear-to-r from-green-500 to-teal-400 text-black ${
      className || ""
    }`}
  >
    {children}
  </button>
);

const Card: React.FC<{ className?: string; children?: React.ReactNode }> = ({
  children,
  className,
}) => (
  <div
    className={`bg-gray-850 rounded-xl p-4 border border-gray-800 shadow ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({
  isOpen,
  toggle,
}) => (
  <>
    {isOpen && (
      <div
        onClick={toggle}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      />
    )}
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 250, damping: 30 }}
      className="fixed lg:relative top-0 left-0 h-screen w-60 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 p-6 shadow-lg z-50 flex flex-col justify-between rounded-xl overflow-y-auto"
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Leaf className="text-green-400 w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-100">GreenScore</h1>
          </div>
          <X
            className="text-gray-400 cursor-pointer lg:hidden"
            onClick={toggle}
          />
        </div>
        <Navbar />
      </div>

      <div className="text-xs text-gray-500 text-center">© 2025 GreenScore</div>
    </motion.aside>
  </>
);

/* ---------------------------- Eco Market ------------------------------- */
const EcoMarket: React.FC = () => {
  // layout / sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // products & filters
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<string>("popular"); // popular | price-asc | price-desc | rating
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // cart drawer
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // product modal
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const payload = await fetchMockProducts();
      if (!mounted) return;
      setProducts(payload);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // derived categories
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  // filtered list
  const filtered = useMemo(() => {
    let list = products.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.includes(q))
      );
    }
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.rating - a.rating); // popular fallback
    return list;
  }, [products, search, category, sort]);

  /* -------------------- cart helpers -------------------- */
  const addToCart = (product: Product, qty = 1) => {
    setCart((c) => {
      const found = c.find((x) => x.product.id === product.id);
      if (found)
        return c.map((x) =>
          x.product.id === product.id
            ? { ...x, qty: Math.min(x.qty + qty, product.stock ?? 999) }
            : x
        );
      return [{ product, qty: Math.min(qty, product.stock ?? 999) }, ...c];
    });
    setCartOpen(true);
  };

  const updateQty = (productId: string, qty: number) => {
    setCart((s) =>
      s.map((it) =>
        it.product.id === productId ? { ...it, qty: Math.max(1, qty) } : it
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((s) => s.filter((it) => it.product.id !== productId));
  };

  const cartTotal = useMemo(
    () => cart.reduce((s, it) => s + it.qty * it.product.price, 0),
    [cart]
  );

  /* -------------------- favorites -------------------- */
  const toggleFav = (id: string) => {
    setFavorites((f) => ({ ...f, [id]: !f[id] }));
  };

  /* -------------------- checkout placeholder -------------------- */
  const handleCheckout = async () => {
    // Replace with your backend integration
    /* await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ items: cart })
    }) */
    alert(
      `Checkout placeholder — total: $${cartTotal.toFixed(
        2
      )}. Integrate your payment API here.`
    );
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 sm:p-6 lg:pl-6 overflow-y-auto min-h-screen">
        {/* Topbar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Menu
              className="text-gray-400 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            />
            <h2 className="text-xl font-bold text-gray-100">Eco Market</h2>
          </div>
          <div className="hidden lg:flex">
            <h2 className="text-xl font-bold text-gray-100">Eco Market</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, e.g., 'solar'"
                className="pl-9 pr-3 py-2 rounded-md bg-black/30 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Search products"
              />
              <Search className="absolute left-2 top-2.5 text-gray-400" />
            </div>

            <Button
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              <span className="ml-1 text-sm font-bold text-gray-900 bg-white/90 px-2 py-0.5 rounded-full">
                {cart.reduce((s, it) => s + it.qty, 0)}
              </span>
            </Button>
          </div>
        </div>

        {/* filters & sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/30 rounded-md px-2 py-1">
              <Filter />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-sm text-gray-200 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-black/30 rounded-md px-2 py-1">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm text-gray-200 outline-none"
              >
                <option value="popular">Popular</option>
                <option value="rating">Highest rating</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            {filtered.length} products
          </div>
        </div>

        {/* product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-850 rounded-xl p-4 h-56"
              />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">
              No products found.
            </div>
          ) : (
            filtered.map((p) => (
              <Card key={p.id} className="flex flex-col h-full">
                <div className="relative rounded-md overflow-hidden h-40 mb-3">
                  {/* image fallback */}
                  <img
                    src={p.img || "/products/placeholder.jpg"}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleFav(p.id)}
                    title={
                      favorites[p.id] ? "Remove favorite" : "Add to favorites"
                    }
                    className="absolute top-2 right-2 bg-black/40 p-2 rounded-md"
                    aria-label="favorite"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites[p.id] ? "text-pink-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-100">
                        {p.title}
                      </div>
                      <div className="text-xs text-gray-400">{p.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-teal-300">
                        ${p.price.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-yellow-300">
                        <Star className="w-3 h-3" /> {p.rating}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => addToCart(p, 1)}
                    disabled={(p.stock ?? 0) <= 0}
                    className={`px-3 py-2 rounded-md text-sm font-semibold ${
                      (p.stock ?? 0) <= 0
                        ? "bg-white/5 text-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-green-500 to-teal-400 text-black"
                    }`}
                    aria-disabled={(p.stock ?? 0) <= 0}
                  >
                    Add to cart
                  </button>

                  <button
                    onClick={() => setSelected(p)}
                    className="px-2 py-2 text-xs rounded-md bg-white/5"
                  >
                    View
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* pagination (simple) */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {filtered.length} results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded bg-white/5 text-xs">
              Prev
            </button>
            <button className="px-2 py-1 rounded bg-white/5 text-xs">
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <motion.aside
        initial={{ x: 400 }}
        animate={{ x: cartOpen ? 0 : 400 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 p-4 z-50 shadow-lg"
        aria-hidden={!cartOpen}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart />
            <h3 className="text-lg font-semibold text-gray-100">Your Cart</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-400 mr-3">
              ${cartTotal.toFixed(2)}
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="px-2 py-1 rounded bg-white/5"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-3 overflow-auto h-[60vh] pb-4">
          {cart.length === 0 && (
            <div className="text-gray-400">
              Your cart is empty — add something eco-friendly!
            </div>
          )}
          {cart.map((it) => (
            <div
              key={it.product.id}
              className="flex items-center gap-3 p-2 rounded bg-black/30"
            >
              <img
                src={it.product.img || "/products/placeholder.jpg"}
                alt={it.product.title}
                className="w-14 h-14 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-sm text-gray-100 font-medium">
                  {it.product.title}
                </div>
                <div className="text-xs text-gray-400">
                  {it.product.category}
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  ${it.product.price.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      updateQty(it.product.id, Math.max(1, it.qty - 1))
                    }
                    className="px-2 py-1 rounded bg-white/5"
                  >
                    -
                  </button>
                  <div className="px-2 text-sm">{it.qty}</div>
                  <button
                    onClick={() => updateQty(it.product.id, it.qty + 1)}
                    className="px-2 py-1 rounded bg-white/5"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(it.product.id)}
                  className="text-xs text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">Shipping</div>
            <div className="text-sm text-gray-100">Free</div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">Subtotal</div>
            <div className="text-lg font-semibold">${cartTotal.toFixed(2)}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCheckout}
              className="flex-1 px-4 py-2 rounded bg-linear-to-r from-green-500 to-teal-400 font-semibold"
            >
              <CreditCard className="inline mr-2" /> Checkout
            </button>
            <button
              onClick={() => {
                setCart([]);
                alert("Cart cleared");
              }}
              className="px-3 py-2 rounded bg-white/5"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Product modal */}
      {selected && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelected(null)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-70 bg-gray-850 rounded-xl p-4 max-w-2xl w-full shadow-lg border border-gray-800"
          >
            <div className="flex items-start gap-4">
              <img
                src={selected.img || "/products/placeholder.jpg"}
                alt={selected.title}
                className="w-36 h-36 object-cover rounded-md"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-100">
                    {selected.title}
                  </h3>
                  <div className="text-sm font-bold text-teal-300">
                    ${selected.price.toFixed(2)}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  {selected.description}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(selected, 1)}
                    className="px-3 py-2 rounded bg-linear-to-r from-green-500 to-teal-400 font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-3 py-2 rounded bg-white/5"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EcoMarket;
