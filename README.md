# Nobabi Style - Bangladesh eCommerce Platform

This is a modern eCommerce website built for the Bangladesh market, supporting both physical and digital products.

## 1. Project Structure

```
/
├── .env.example
├── package.json
├── vite.config.ts
├── src/
│   ├── App.tsx                 # Main routing component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles & Tailwind config
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Top navigation with cart/user
│   │   │   ├── Footer.tsx      # Site footer
│   │   │   └── CartDrawer.tsx  # Slide-out shopping cart
│   │   └── ui/
│   │       ├── Button.tsx      # Reusable button component
│   │       ├── Input.tsx       # Reusable input component
│   │       └── ProductCard.tsx # Product display card
│   ├── data/
│   │   └── mockData.ts         # Mock products and categories
│   ├── pages/
│   │   ├── Home.tsx            # Landing page & category view
│   │   ├── ProductDetails.tsx  # Single product view
│   │   ├── Checkout.tsx        # Payment & shipping flow
│   │   ├── Login.tsx           # User authentication
│   │   ├── AdminDashboard.tsx  # Admin management panel
│   │   └── UserDashboard.tsx   # User order history
│   ├── store/
│   │   ├── useCartStore.ts     # Zustand cart state management
│   │   └── useUserStore.ts     # Zustand user auth state
│   └── lib/
│       └── utils.ts            # Utility functions (cn)
```

## 2. Setup Instructions

To run this project locally:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nobabistyle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 3. Environment Variables Example

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (For Backend)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"

# App Configuration
VITE_APP_URL="http://localhost:3000"
```

## 4. Step-by-Step Deployment Guide (Vercel)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com/) and sign in.
   - Click "Add New..." > "Project".
   - Import your GitHub repository.
   - In the "Environment Variables" section, add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Click "Deploy".

3. **Connect Supabase (Backend Setup)**
   - Go to [Supabase](https://supabase.com/) and create a new project.
   - Go to the SQL Editor and run the following schema to create your tables:

   ```sql
   -- Create Users Table
   CREATE TABLE users (
     id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
     email TEXT NOT NULL,
     full_name TEXT,
     role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Create Products Table
   CREATE TABLE products (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     discount_price DECIMAL(10,2),
     category TEXT NOT NULL,
     stock INTEGER DEFAULT 0,
     is_digital BOOLEAN DEFAULT FALSE,
     images TEXT[] DEFAULT '{}',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   -- Create Orders Table
   CREATE TABLE orders (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
     total_amount DECIMAL(10,2) NOT NULL,
     shipping_address JSONB,
     payment_method TEXT NOT NULL,
     payment_status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );
   ```

   - Set up Supabase Storage buckets for `product-images` and `digital-products`.
   - Update your Vercel environment variables with the Supabase credentials.

## 5. Features Implemented

- **eCommerce System**: Product listing, details, categories, cart, and checkout.
- **Payment System**: UI for bKash, Nagad, Rocket, and COD with manual verification flow.
- **State Management**: Persistent cart using Zustand.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Dashboards**: Separate views for Admin and Users.
