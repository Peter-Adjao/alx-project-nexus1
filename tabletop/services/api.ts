// Fake Store API integration service
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

class APIService {
  private baseURL = 'https://fakestoreapi.com';

  async getProducts(limit?: number): Promise<Product[]> {
    try {
      const url = limit ? `${this.baseURL}/products?limit=${limit}` : `${this.baseURL}/products`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data as fallback
      return this.getMockProducts();
    }
  }

  async getProduct(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseURL}/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return this.getMockProducts().find(p => p.id === id) || null;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/products/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseURL}/products/category/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching category products:', error);
      return [];
    }
  }

  // Mock reviews data since the API doesn't provide reviews
  getProductReviews(productId: number): Review[] {
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Sarah Johnson',
        rating: 5,
        comment: 'Excellent product! Exactly as described and great quality. Would definitely recommend to others.',
        date: '2024-01-15',
        verified: true,
        helpful: 12
      },
      {
        id: '2',
        userId: '2',
        userName: 'Mike Chen',
        rating: 4,
        comment: 'Good value for money. Shipping was fast and packaging was secure. Minor issues but overall satisfied.',
        date: '2024-01-10',
        verified: true,
        helpful: 8
      },
      {
        id: '3',
        userId: '3',
        userName: 'Emily Davis',
        rating: 5,
        comment: 'Love this purchase! Perfect fit and the quality exceeded my expectations. Will buy again.',
        date: '2024-01-05',
        verified: false,
        helpful: 5
      },
      {
        id: '4',
        userId: '4',
        userName: 'David Wilson',
        rating: 3,
        comment: 'Average product. Does the job but nothing special. Could be improved in some areas.',
        date: '2023-12-28',
        verified: true,
        helpful: 3
      }
    ];

    // Return random subset of reviews for different products
    const randomReviews = [...mockReviews].sort(() => Math.random() - 0.5);
    return randomReviews.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        title: "Premium Leather Handbag",
        price: 89.99,
        description: "Elegant leather handbag perfect for daily use",
        category: "fashion",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        rating: { rate: 4.5, count: 128 }
      },
      {
        id: 2,
        title: "Classic Canvas Sneakers",
        price: 49.99,
        description: "Comfortable canvas sneakers for casual wear",
        category: "footwear",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
        rating: { rate: 4.8, count: 256 }
      }
    ];
  }
}

export const apiService = new APIService();