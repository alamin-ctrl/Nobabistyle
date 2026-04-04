import { useState, useEffect } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';
import { Product, Category } from '../data/mockData';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        if (!hasSupabaseConfig || !supabase) {
          throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the AI Studio Secrets panel.");
        }

        let query = supabase.from('products').select('*');
        
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        
        const { data, error: err } = await query;
        
        if (err) throw err;
        
        if (data) {
          // Map database snake_case to frontend camelCase
          const formattedData: Product[] = data.map(d => ({
            id: d.id,
            name: d.name,
            price: d.price,
            discountPrice: d.discount_price,
            description: d.description,
            images: d.images || [],
            category: d.category as Category,
            stock: d.stock,
            isDigital: d.is_digital,
            rating: d.rating || 0,
            reviews: d.reviews || 0,
          }));
          setProducts(formattedData);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}

export function useProduct(id?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        if (!hasSupabaseConfig || !supabase) {
          throw new Error("Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the AI Studio Secrets panel.");
        }

        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (err) throw err;
        
        if (data) {
          setProduct({
            id: data.id,
            name: data.name,
            price: data.price,
            discountPrice: data.discount_price,
            description: data.description,
            images: data.images || [],
            category: data.category as Category,
            stock: data.stock,
            isDigital: data.is_digital,
            rating: data.rating || 0,
            reviews: data.reviews || 0,
          });
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
