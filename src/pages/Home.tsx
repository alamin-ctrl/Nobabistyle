import React from 'react';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Truck, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

export function Home() {
  const { category } = useParams<{ category: string }>();
  const { products: displayedProducts, loading, error } = useProducts(category);

  const featuredProducts = displayedProducts.slice(0, 4);
  const digitalProducts = displayedProducts.filter(p => p.isDigital).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {!category && (
        <section className="relative bg-gray-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                  Discover Quality Products in <span className="text-blue-600">Bangladesh</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Shop the latest fashion trends and premium digital products. Fast delivery across Bangladesh with secure mobile banking payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Digital
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 transform translate-x-10 translate-y-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200" 
                  alt="Shopping" 
                  className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {!category && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Nationwide Delivery</h3>
                  <p className="text-sm text-gray-500">Fast shipping across BD</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                  <p className="text-sm text-gray-500">bKash, Nagad, Rocket</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Download</h3>
                  <p className="text-sm text-gray-500">For digital products</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {category ? `${category} Products` : 'Featured Products'}
            </h2>
            {!category && (
              <Link to="/category/all" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          
          {error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block border border-red-200 max-w-2xl">
                <h3 className="font-bold mb-2">Database Connection Error</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Digital Products */}
      {!category && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Digital Assets</h2>
              <Link to="/category/Digital" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {error ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Could not load digital products.</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : digitalProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No digital products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {digitalProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
