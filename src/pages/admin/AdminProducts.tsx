import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import { SqlSnippetModal } from '../../components/admin/SqlSnippetModal';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../data/mockData';

const PRODUCTS_SQL = `-- Products Table & RLS Setup

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  discount_price numeric,
  stock integer not null default 0,
  category text not null,
  images text[] not null default '{}',
  is_digital boolean not null default false,
  rating numeric default 0,
  reviews integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

-- Everyone can view products
create policy "Products are viewable by everyone." 
  on public.products for select using (true);

-- Only admins can insert, update, or delete products
create policy "Admins can insert products." 
  on public.products for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update products." 
  on public.products for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete products." 
  on public.products for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
`;

export function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: 'Men',
    images: '',
    isDigital: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;

      if (data) {
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
        stock: product.stock.toString(),
        category: product.category,
        images: product.images.join(', '),
        isDigital: product.isDigital
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        category: 'Men',
        images: '',
        isDigital: false
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stock: parseInt(formData.stock, 10),
        category: formData.category,
        images: formData.images.split(',').map(s => s.trim()).filter(s => s),
        is_digital: formData.isDigital
      };

      if (editingId) {
        const { error: err } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('products')
          .insert([productData]);
        if (err) throw err;
      }

      handleCloseForm();
      fetchProducts();
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (err) throw err;
      fetchProducts();
    } catch (err: any) {
      alert('Error deleting product: ' + err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your store inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-md font-medium transition-colors"
          >
            <ShieldAlert className="h-4 w-4" />
            Fix Permissions (SQL)
          </button>
          <Button className="flex items-center gap-2" onClick={() => handleOpenForm()}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mb-6">
          <p>Error loading products: {error}</p>
          <p className="text-sm mt-1">Make sure you have run the setup SQL.</p>
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500">Product</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Price</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        {product.isDigital && (
                          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 mt-1">
                            Digital
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">৳ {product.discountPrice || product.price}</span>
                        {product.discountPrice && (
                          <span className="text-xs text-gray-400 line-through">৳ {product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenForm(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No products found. Click "Add Product" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={handleCloseForm} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="product-form" onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
                    <input 
                      required 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (৳)</label>
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input 
                      required 
                      type="number" 
                      min="0"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Digital">Digital</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.images}
                    onChange={e => setFormData({...formData, images: e.target.value})}
                    placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" 
                  />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="isDigital"
                    checked={formData.isDigital}
                    onChange={e => setFormData({...formData, isDigital: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isDigital" className="text-sm font-medium text-gray-700">
                    This is a digital product
                  </label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
              <Button type="submit" form="product-form">Save Product</Button>
            </div>
          </div>
        </div>
      )}

      <SqlSnippetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Products SQL" 
        sqlCode={PRODUCTS_SQL} 
      />
    </div>
  );
}
