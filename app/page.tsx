"use client";

import React, { useState } from 'react';
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Package, Truck } from "lucide-react";
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function Homepage() {
  const products = useQuery(api.products.getAll);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const pay = useAction(api.stripe.pay);
  const router = useRouter();

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const isInCart = (productId: string) => cart.some((item) => item._id === productId);

  const scrollToElement = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = async () => {
    const cartItems = cart.map(item => ({
      _id: item._id,
      title: item.title,
      price: item.price,
      quantity: 1,
    }));

    const { url } = await pay({ cartItems });
    if (!url) return;
    router.push(url);
  }

  return (
    <div className="min-h-screen bg-white text-black-100">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-black">
          Welcome to My Store
        </h1>
        <p className="text-xl mb-8 text-black-300">Discover unique products for your lifestyle</p>
        <Button onClick={scrollToElement} className="bg-orange-400 hover:bg-orange-700 text-white">
          Shop Now
        </Button>
      </section>

      {/* Product List */}
      <section id="products" className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-black-300">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product: Product) => (
              <Card key={product._id} className="bg-orange-50 border-orange-800 shadow-lg shadow-orange-500/50">
                <CardHeader>
                  <img src={product.imageUrl} alt={product.title} className="w-full h-72 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-bold mb-2 text-black-300">{product.title}</CardTitle>
                  <p className="text-black-400 mb-4">{product.description}</p>
                  <p className="text-2xl font-bold text-black-200">${product.price.toFixed(2)}</p>
                  <p className="text-black-400 mt-2 flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Delivery: 2-3 Days
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${isInCart(product._id) ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-400 hover:bg-orange-700'}`}
                    onClick={() => isInCart(product._id) ? removeFromCart(product._id) : addToCart(product)}
                  >
                    {isInCart(product._id) ? 'Remove from Cart' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 bg-orange-400 hover:bg-orange-700">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({cart.length})
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-orange-50 text-black-100">
          <SheetHeader>
            <SheetTitle className="text-black-300">Your Cart</SheetTitle>
          </SheetHeader>
          {cart.length === 0 ? (
            <p className="text-black-400 mt-4">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b border-orange-800">
                  <span className="text-black-300">{item.title}</span>
                  <span className="text-black-200">${item.price.toFixed(2)}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="mt-4">
                <p className="text-xl font-bold text-black-200 mb-4">
                  Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleCheckout}
                  disabled={isCheckingOut}>
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}