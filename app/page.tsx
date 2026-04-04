"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import productImage from "../Images/Image.jpg";
import logoImage from "../Images/LOGO.png";
import { clearSessionEmail, getSessionEmail, getStoredUser } from "./auth-storage";
import ThemeToggle from "./theme-toggle";

type NotificationItem = {
  id: number;
  message: string;
  isRead: boolean;
};

const products = [
  {
    name: "Handwoven Basket",
    description: "Eco-friendly storage basket made from natural fibers.",
    price: "$24",
    category: "Home Decor",
    accentBorder: "border-emerald-200 dark:border-emerald-900/60",
    accentBackground: "bg-emerald-50/70 dark:bg-emerald-950/40",
    accentText: "text-emerald-700 dark:text-emerald-300",
  },
  {
    name: "Clay Aroma Lamp",
    description: "Hand-shaped ceramic lamp for warm and calming evenings.",
    price: "$32",
    category: "Lighting",
    accentBorder: "border-yellow-200 dark:border-yellow-900/60",
    accentBackground: "bg-yellow-50/70 dark:bg-yellow-950/40",
    accentText: "text-yellow-700 dark:text-yellow-300",
  },
  {
    name: "Embroidered Wall Art",
    description: "Traditional threadwork framed for modern home decor.",
    price: "$41",
    category: "Wall Art",
    accentBorder: "border-lime-200 dark:border-lime-900/60",
    accentBackground: "bg-lime-50/70 dark:bg-lime-950/40",
    accentText: "text-lime-700 dark:text-lime-300",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedTerm, setSearchedTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => getSessionEmail());

  const categories = useMemo(
    () => ["All Categories", ...new Set(products.map((product) => product.category))],
    []
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchedTerm.trim().toLowerCase();
    const hasCategoryFilter = selectedCategory !== "All Categories";

    return products.filter((product) => {
      const searchableText = `${product.name} ${product.description}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory = !hasCategoryFilter || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchedTerm, selectedCategory]);

  const suggestions = useMemo(() => {
    const normalizedInput = searchTerm.trim().toLowerCase();

    if (!normalizedInput) {
      return [];
    }

    return products
      .map((product) => product.name)
      .filter((name) => name.toLowerCase().includes(normalizedInput))
      .slice(0, 5);
  }, [searchTerm]);

  const totalCartItems = useMemo(
    () => Object.values(cartItems).reduce((total, quantity) => total + quantity, 0),
    [cartItems]
  );

  const unreadNotificationCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const cartDetails = useMemo(
    () =>
      Object.entries(cartItems)
        .filter(([, quantity]) => quantity > 0)
        .map(([productName, quantity]) => {
          const product = products.find((item) => item.name === productName);
          const unitPrice = Number(product?.price.replace("$", "") ?? 0);

          return {
            name: productName,
            quantity,
            unitPrice,
            subtotal: unitPrice * quantity,
          };
        }),
    [cartItems]
  );

  const cartTotalAmount = useMemo(
    () => cartDetails.reduce((total, item) => total + item.subtotal, 0),
    [cartDetails]
  );

  const addNotification = (message: string) => {
    setNotifications((previous) => [
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        message,
        isRead: false,
      },
      ...previous,
    ]);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedTerm(searchTerm.trim());
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSearchedTerm(suggestion);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryMenuOpen(false);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFavoriteToggle = (productName: string) => {
    const isFavorite = favoriteProducts.includes(productName);

    if (isFavorite) {
      setFavoriteProducts(favoriteProducts.filter((name) => name !== productName));
      addNotification(`Removed ${productName} from favorites.`);
      return;
    }

    setFavoriteProducts([...favoriteProducts, productName]);
    addNotification(`Added ${productName} to favorites.`);
  };

  const handleAddToCart = (productName: string) => {
    setCartItems((previous) => {
      const nextQuantity = (previous[productName] ?? 0) + 1;
      return {
        ...previous,
        [productName]: nextQuantity,
      };
    });

    addNotification(`Added ${productName} to cart.`);
  };

  const closeOtherMenus = (currentMenu: "category" | "cart" | "notification" | "account") => {
    if (currentMenu !== "category") {
      setIsCategoryMenuOpen(false);
    }

    if (currentMenu !== "cart") {
      setIsCartMenuOpen(false);
    }

    if (currentMenu !== "notification") {
      setIsNotificationMenuOpen(false);
    }

    if (currentMenu !== "account") {
      setIsAccountMenuOpen(false);
    }
  };

  const toggleCategoryMenu = () => {
    closeOtherMenus("category");
    setIsCategoryMenuOpen((previous) => !previous);
  };

  const toggleCartMenu = () => {
    closeOtherMenus("cart");
    setIsCartMenuOpen((previous) => !previous);
  };

  const toggleNotificationMenu = () => {
    closeOtherMenus("notification");
    setIsNotificationMenuOpen((previous) => {
      const nextOpenState = !previous;

      if (nextOpenState) {
        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      }

      return nextOpenState;
    });
  };

  const toggleAccountMenu = () => {
    closeOtherMenus("account");
    setIsAccountMenuOpen((previous) => !previous);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeCartItem = (productName: string) => {
    setCartItems((previous) => {
      const nextCart = { ...previous };
      delete nextCart[productName];
      return nextCart;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const handleCartCheckout = () => {
    if (totalCartItems === 0) {
      return;
    }

    setIsCartMenuOpen(false);
    addNotification(`Checkout started for ${totalCartItems} item${totalCartItems === 1 ? "" : "s"}.`);
  };

  const handleCheckoutClick = () => {
    closeOtherMenus("cart");
    setIsCartMenuOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBuyClick = (productName: string) => {
    handleAddToCart(productName);
    handleCheckoutClick();
  };

  const handleAccountOptionSelect = () => {
    setIsAccountMenuOpen(false);
  };

  const handleSignOut = () => {
    clearSessionEmail();
    setSessionEmail(null);
    setIsAccountMenuOpen(false);
    addNotification("Signed out successfully.");
  };

  const resetLandingExperience = () => {
    setSearchTerm("");
    setSearchedTerm("");
    setSelectedCategory("All Categories");
    setIsCategoryMenuOpen(false);
    setIsCartMenuOpen(false);
    setIsNotificationMenuOpen(false);
    setIsAccountMenuOpen(false);
    setFavoriteProducts([]);
    setCartItems({});
    setNotifications([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 pt-6 md:px-10">
        <Link href="/" aria-label="Go to home page" onClick={resetLandingExperience}>
          <Image
            src={logoImage}
            alt="Khosto logo"
            className="h-20 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products"
                className="w-80 rounded-full border border-emerald-200 bg-emerald-50/60 px-4 py-2 text-sm text-emerald-900 outline-none transition focus:border-emerald-500 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100 dark:focus:border-emerald-400"
              />
              <button
                type="submit"
                className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
              >
                Search
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute left-0 top-full z-10 mt-2 w-80 rounded-xl border border-emerald-200 bg-emerald-50 p-1 shadow-sm dark:border-emerald-900 dark:bg-emerald-950">
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>
          <Link
            href="/"
            onClick={resetLandingExperience}
            className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-900 transition hover:bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
          >
            Home
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={toggleCategoryMenu}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900"
            >
              Categories
              <span
                aria-hidden="true"
                className={`text-xs transition-transform duration-200 ${
                  isCategoryMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▾
              </span>
            </button>
            <div
              className={`absolute right-0 top-full z-10 mt-2 w-52 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm transition-all duration-300 dark:border-emerald-900 dark:bg-emerald-950 ${
                isCategoryMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="p-1">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="View cart"
              onClick={toggleCartMenu}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300 bg-yellow-100 text-lg text-yellow-900 transition hover:bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
            >
              <span aria-hidden="true">🛒</span>
              {totalCartItems > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1.5 text-xs font-bold text-white dark:bg-emerald-500">
                  {totalCartItems}
                </span>
              )}
            </button>
            {isCartMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-80 rounded-xl border border-yellow-300 bg-yellow-50 p-3 shadow-sm dark:border-yellow-800 dark:bg-yellow-950/70">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Cart Items</p>
                  {cartDetails.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {cartDetails.length === 0 ? (
                  <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80">Your cart is empty.</p>
                ) : (
                  <>
                    <ul className="space-y-2">
                      {cartDetails.map((item) => (
                        <li
                          key={item.name}
                          className="rounded-lg border border-yellow-200 bg-white px-3 py-2 dark:border-yellow-800 dark:bg-yellow-900/40"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">{item.name}</p>
                              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                Qty: {item.quantity} • ${item.unitPrice} each
                              </p>
                              <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100">
                                Subtotal: ${item.subtotal}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCartItem(item.name)}
                              className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 border-t border-yellow-200 pt-2 dark:border-yellow-800">
                      <p className="text-sm font-bold text-yellow-900 dark:text-yellow-100">
                        Total: ${cartTotalAmount}
                      </p>
                      <button
                        type="button"
                        onClick={handleCartCheckout}
                        className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={toggleNotificationMenu}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/70 text-lg text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900"
            >
              <span aria-hidden="true">🔔</span>
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1.5 text-xs font-bold text-white dark:bg-yellow-400 dark:text-yellow-950">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
            {isNotificationMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm dark:border-emerald-900 dark:bg-emerald-950">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Notifications</p>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">No notifications yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {notifications.slice(0, 6).map((notification) => (
                      <li
                        key={notification.id}
                        className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100"
                      >
                        {notification.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={toggleAccountMenu}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900"
            >
              Account
              <span
                aria-hidden="true"
                className={`text-xs transition-transform duration-200 ${
                  isAccountMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▾
              </span>
            </button>
            <div
              className={`absolute right-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm transition-all duration-300 dark:border-emerald-900 dark:bg-emerald-950 ${
                isAccountMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {sessionEmail ? (
                <div className="p-2">
                  <p className="px-2 pb-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {getStoredUser()?.name ?? sessionEmail}
                  </p>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <ul className="p-1">
                  <li>
                    <Link
                      href="/sign-in"
                      onClick={handleAccountOptionSelect}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign-up"
                      onClick={handleAccountOptionSelect}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <ThemeToggle className="-mt-1" />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12 md:px-10">
        <section className="relative space-y-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-8 dark:border-emerald-900 dark:bg-emerald-950/30">
          <span className="pointer-events-none absolute -right-6 -top-6 h-10 w-6 rotate-12 rounded-full bg-emerald-200/70 dark:bg-emerald-800/60" />
          <span className="pointer-events-none absolute -right-2 -top-4 h-8 w-5 -rotate-6 rounded-full bg-yellow-200/70 dark:bg-yellow-800/50" />
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            Khosto Handicrafts
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            Handmade products crafted with tradition and care.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-emerald-900/85 dark:text-emerald-100/90">
            Discover authentic handicraft pieces created by local artisans. Every
            item is made in small batches, preserving cultural artistry and
            sustainable techniques.
          </p>
          <a
            href="#products"
            className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-5 py-2.5 text-sm font-semibold text-yellow-900 hover:bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
          >
            Shop Featured Items
          </a>
        </section>

        <section id="products" className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            {searchedTerm ? `Search Results for "${searchedTerm}"` : "Featured Products"}
          </h2>
          {(searchedTerm || selectedCategory !== "All Categories") && (
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              {selectedCategory !== "All Categories" && `${selectedCategory} • `}
              {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"} found.
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.name}
                className={`relative rounded-xl border bg-white p-5 dark:bg-zinc-950 ${product.accentBorder} ${product.accentBackground}`}
              >
                <button
                  type="button"
                  aria-label={`Toggle favorite for ${product.name}`}
                  onClick={() => handleFavoriteToggle(product.name)}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white/90 text-base transition hover:bg-white dark:border-emerald-800 dark:bg-emerald-950/80"
                >
                  <span aria-hidden="true">
                    {favoriteProducts.includes(product.name) ? "❤️" : "🤍"}
                  </span>
                </button>
                <Image
                  src={productImage}
                  alt={product.name}
                  className="h-44 w-full rounded-lg object-cover"
                />
                <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                <p className={`mt-1 text-xs font-semibold uppercase tracking-wide ${product.accentText}`}>
                  {product.category}
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-900/80 dark:text-emerald-100/80">
                  {product.description}
                </p>
                <p className="mt-4 text-sm font-bold">{product.price}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product.name)}
                      className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-900 hover:bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyClick(product.name)}
                      className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:bg-emerald-900/70"
                    >
                      Buy
                    </button>
                  </div>
                  {(cartItems[product.name] ?? 0) > 0 && (
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                      In cart: {cartItems[product.name]}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          {(searchedTerm || selectedCategory !== "All Categories") && filteredProducts.length === 0 && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              No products match your selected filters.
            </p>
          )}
        </section>

        <section className="grid gap-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 p-8 dark:border-emerald-900 dark:bg-emerald-950/30 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">About Our Craft</h2>
            <p className="text-sm leading-7 text-emerald-900/85 dark:text-emerald-100/85">
              We collaborate with artisan communities to bring timeless handmade
              pieces to modern homes. Your purchase supports fair wages, local
              traditions, and responsible materials.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Get in Touch</h2>
            <p className="text-sm leading-7 text-emerald-900/85 dark:text-emerald-100/85">
              Interested in custom orders or wholesale? Contact us and we’ll help
              you choose handcrafted products for your needs.
            </p>
            <a
              href="mailto:hello@khosto.com"
              className="inline-flex rounded-full border border-yellow-300 bg-yellow-100 px-5 py-2.5 text-sm font-semibold text-yellow-900 hover:bg-yellow-200 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200 dark:hover:bg-yellow-900/70"
            >
              hello@khosto.com
            </a>
          </div>
        </section>

        <footer className="pb-2 text-center text-sm text-emerald-700/80 dark:text-emerald-300/80">
          © 2026 Khosto Handicrafts. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
