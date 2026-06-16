export interface House {
  id: string;
  census_number: string;
  head_name: string;
  total_rooms: number;
  married_couples: number;
  has_car: boolean;
  has_tv: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  total_cars: number;
  total_tvs: number;
  total_married_couples: number;
  total_rooms: number;
}
