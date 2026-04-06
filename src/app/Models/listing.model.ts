export interface Listing {
  id?: string;
  name: string;
  price: number;
  currency: string;
  location: string;
  description: string;
  img: string;
  hasDelivery: boolean;
  phoneNumber: string;
  categoryId: string;

  // ✅ New fields added here:
  sellerName?: string;
  sellerRating?: number;
  memberSince?: string;
  views?: number;
  status?: 'active' | 'sold';
  imageCount?: number;
}