import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Loader2, Upload, Trash2, ShieldAlert, Store, Image as ImageIcon } from 'lucide-react';
import { SqlSnippetModal } from '../../components/admin/SqlSnippetModal';
import { motion } from 'motion/react';

const OUTLET_SQL = `-- Create table for outlet images
create table if not exists public.outlet_images (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.outlet_images enable row level security;

-- Ensure admin role for specific emails
update public.profiles 
set role = 'admin' 
where email in ('alaminid6@gmail.com', 'admin@nobabistyle.com');

drop policy if exists "Public outlet images are viewable by everyone." on public.outlet_images;
drop policy if exists "Admins can insert outlet images." on public.outlet_images;
drop policy if exists "Admins can delete outlet images." on public.outlet_images;

create policy "Public outlet images are viewable by everyone." 
  on public.outlet_images for select using (true);

create policy "Admins can insert outlet images." 
  on public.outlet_images for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') OR 
    (auth.jwt() ->> 'email') in ('alaminid6@gmail.com', 'admin@nobabistyle.com')
  );

create policy "Admins can delete outlet images." 
  on public.outlet_images for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') OR 
    (auth.jwt() ->> 'email') in ('alaminid6@gmail.com', 'admin@nobabistyle.com')
  );

-- Create storage bucket for outlet images
insert into storage.buckets (id, name, public) 
values ('outlet-images', 'outlet-images', true) 
on conflict (id) do nothing;

-- Set up storage policies
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Admin Insert" on storage.objects;
drop policy if exists "Admin Delete" on storage.objects;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'outlet-images' );

create policy "Admin Insert"
  on storage.objects for insert
  with check ( 
    bucket_id = 'outlet-images' and (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') OR 
      (auth.jwt() ->> 'email') in ('alaminid6@gmail.com', 'admin@nobabistyle.com')
    )
  );

create policy "Admin Delete"
  on storage.objects for delete
  using ( 
    bucket_id = 'outlet-images' and (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') OR 
      (auth.jwt() ->> 'email') in ('alaminid6@gmail.com', 'admin@nobabistyle.com')
    )
  );
`;

export function AdminOutlet() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('outlet_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching outlet images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('outlet-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error details:', uploadError);
        throw new Error(`Storage error: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('outlet-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('outlet_images')
        .insert([{ url: publicUrl }]);

      if (dbError) {
        console.error('Database insert error details:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      await fetchImages();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message || 'Unknown error'}. Please make sure you have run the SQL setup.`);
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Extract filename from URL
      const fileName = url.split('/').pop();
      
      if (fileName) {
        await supabase.storage
          .from('outlet-images')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('outlet_images')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-serif tracking-tight text-black uppercase">Offline Outlet</h1>
          <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold">Manage flagship store gallery</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gold-500 hover:text-black text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500"
          >
            <ShieldAlert className="h-3 w-3" />
            Setup Database
          </button>
        </div>
      </div>

      <div className="bg-white p-10 border border-black/5 shadow-sm">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-black uppercase tracking-tight">Store Gallery</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Upload images to showcase your atelier</p>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label htmlFor="image-upload">
              <Button 
                as="span" 
                className="cursor-pointer flex items-center gap-3 rounded-none h-14 px-8 bg-black text-white hover:bg-gold-500 hover:text-black transition-all duration-500 text-[10px] tracking-[0.3em] font-bold uppercase" 
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-6">
            <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
            <p className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-bold">Loading Gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-black/5 bg-gray-50/30">
            <Store className="h-12 w-12 text-gray-200 mx-auto mb-6" />
            <p className="text-black font-serif text-xl uppercase tracking-tight mb-2">No images uploaded yet</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Upload your first image to showcase your flagship store</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {images.map((image, index) => (
              <motion.div 
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-[3/4] overflow-hidden bg-gray-50 border border-black/5"
              >
                <img 
                  src={image.url} 
                  alt="Outlet" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <button
                    onClick={() => handleDelete(image.id, image.url)}
                    className="p-4 bg-white text-black hover:bg-red-500 hover:text-white transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <SqlSnippetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Offline Outlet Setup SQL" 
        sqlCode={OUTLET_SQL} 
      />
    </div>
  );
}
