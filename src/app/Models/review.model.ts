export interface Review {
  id?: string;
  listingId: string; // Which item was bought?
  sellerId?: string; // Who is being rated? (Optional for now)
  rating: number;    // 1 to 5
  comment: string;
  userName: string;  // Name of the buyer
  date: number;      // When did they write it?
}