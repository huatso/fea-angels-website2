export type Testimonial = {
  id: number;
  quote: string;
  name: string;
  role: string;
  company: string;
  type: "investor" | "founder";
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};
