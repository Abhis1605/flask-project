export interface Role {
  id: number;
  code: string;
  display_name: string;
}

export interface Permissions {
  can_view_products: boolean;
  can_create_product: boolean;
  can_update_product: boolean;
  can_delete_product: boolean;
  can_view_categories: boolean;
  can_create_category: boolean;
  can_update_category: boolean;
  can_delete_category: boolean;
  can_view_stock: boolean;
  can_update_stock: boolean;
  can_manage_users: boolean;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  permissions: Permissions;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  access_token: string;
}

export interface RefreshResponseData {
  access_token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
