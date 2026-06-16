/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type AddToCartInput = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type Address = {
  __typename: 'Address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  postalCode?: Maybe<Scalars['String']['output']>;
  street: Scalars['String']['output'];
};

export type AuthResponse = {
  __typename: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type CartItemType = {
  __typename: 'CartItemType';
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
};

export type CartType = {
  __typename: 'CartType';
  items: Array<CartItemType>;
  total: Scalars['Float']['output'];
};

export type Category = {
  __typename: 'Category';
  children?: Maybe<Array<Category>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Category>;
};

export type CreateAddressInput = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  isDefault?: Scalars['Boolean']['input'];
  postalCode?: InputMaybe<Scalars['String']['input']>;
  street: Scalars['String']['input'];
};

export type CreateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateProductInput = {
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  imageKeys?: Array<Scalars['String']['input']>;
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock: Scalars['Int']['input'];
};

export type CustomerProfile = {
  __typename: 'CustomerProfile';
  lastOrderAt?: Maybe<Scalars['String']['output']>;
  totalOrders: Scalars['Int']['output'];
  totalSpent: Scalars['Float']['output'];
  user: User;
};

export type DashboardStats = {
  __typename: 'DashboardStats';
  lowStockProducts: Scalars['Int']['output'];
  pendingOrders: Scalars['Int']['output'];
  revenueLastMonth: Scalars['Float']['output'];
  revenueThisMonth: Scalars['Float']['output'];
  totalCustomers: Scalars['Int']['output'];
  totalOrders: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  addAddress: Address;
  addToCart: Scalars['Boolean']['output'];
  addToWishlist: Scalars['Boolean']['output'];
  bulkDeleteProducts: Scalars['Int']['output'];
  bulkUpdateProducts: Scalars['Int']['output'];
  cancelMyOrder: Order;
  createCategory: Category;
  /** Create a Stripe Checkout Session URL for the given order */
  createCheckoutSession: Scalars['String']['output'];
  createProduct: Product;
  createReview: Review;
  deactivateUser: User;
  deleteReview: Scalars['Boolean']['output'];
  login: AuthResponse;
  placeOrder: Order;
  refreshToken: AuthResponse;
  register: AuthResponse;
  removeAddress: Scalars['Boolean']['output'];
  removeCategory: Scalars['Boolean']['output'];
  removeFromCart: Scalars['Boolean']['output'];
  removeFromWishlist: Scalars['Boolean']['output'];
  removeProduct: Scalars['Boolean']['output'];
  requestProductUploadUrl: UploadUrlResponse;
  setDefaultAddress: Address;
  updateAddress: Address;
  updateCartItemQuantity: Scalars['Boolean']['output'];
  updateCategory: Category;
  updateOrderStatus: Order;
  updateProduct: Product;
  updateReview: Review;
};


export type MutationAddAddressArgs = {
  input: CreateAddressInput;
};


export type MutationAddToCartArgs = {
  input: AddToCartInput;
};


export type MutationAddToWishlistArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationBulkDeleteProductsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationBulkUpdateProductsArgs = {
  ids: Array<Scalars['ID']['input']>;
  isActive: Scalars['Boolean']['input'];
};


export type MutationCancelMyOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCheckoutSessionArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateReviewArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};


export type MutationDeactivateUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteReviewArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationPlaceOrderArgs = {
  shippingAddressId: Scalars['ID']['input'];
};


export type MutationRefreshTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRemoveAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromCartArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationRemoveFromWishlistArgs = {
  productId: Scalars['ID']['input'];
};


export type MutationRemoveProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRequestProductUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
};


export type MutationSetDefaultAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAddressArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAddressInput;
};


export type MutationUpdateCartItemQuantityArgs = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateOrderStatusArgs = {
  id: Scalars['ID']['input'];
  status: OrderStatus;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};


export type MutationUpdateReviewArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};

export type Order = {
  __typename: 'Order';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  shippingAddressId?: Maybe<Scalars['ID']['output']>;
  status: OrderStatus;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type OrderItem = {
  __typename: 'OrderItem';
  id: Scalars['ID']['output'];
  orderId: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  unitPrice: Scalars['Float']['output'];
};

export enum OrderStatus {
  AwaitingPayment = 'AWAITING_PAYMENT',
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Delivered = 'DELIVERED',
  PaymentFailed = 'PAYMENT_FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED'
}

export type PaginatedProducts = {
  __typename: 'PaginatedProducts';
  hasMore: Scalars['Boolean']['output'];
  items: Array<Product>;
  total: Scalars['Int']['output'];
};

export type Product = {
  __typename: 'Product';
  averageRating: Scalars['Float']['output'];
  category: Category;
  categoryId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageKeys: Array<Scalars['String']['output']>;
  imageUrls: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  lowStockThreshold: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  relatedProducts: Array<Product>;
  reviewCount: Scalars['Int']['output'];
  stock: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type ProductRelatedProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename: 'Query';
  adminProducts: PaginatedProducts;
  categories: Array<Category>;
  category: Category;
  customer: CustomerProfile;
  customers: Array<CustomerProfile>;
  dashboardStats: DashboardStats;
  exportOrders: Array<Order>;
  lowStockProducts: Array<Product>;
  me: User;
  myAddresses: Array<Address>;
  myCart: CartType;
  myOrder: Order;
  myOrders: Array<Order>;
  myWishlist: Array<Product>;
  orders: Array<Order>;
  product: Product;
  productReviews: Array<Review>;
  products: PaginatedProducts;
  revenueChart: Array<RevenueDataPoint>;
  topProducts: Array<TopProduct>;
  users: Array<User>;
};


export type QueryAdminProductsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomersArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExportOrdersArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
};


export type QueryLowStockProductsArgs = {
  threshold?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRevenueChartArgs = {
  days?: Scalars['Int']['input'];
};


export type QueryTopProductsArgs = {
  limit?: Scalars['Int']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<UserRole>;
};

export type RevenueDataPoint = {
  __typename: 'RevenueDataPoint';
  date: Scalars['String']['output'];
  orderCount: Scalars['Int']['output'];
  revenue: Scalars['Float']['output'];
};

export type Review = {
  __typename: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  orderId: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type TopProduct = {
  __typename: 'TopProduct';
  product: Product;
  totalRevenue: Scalars['Float']['output'];
  totalSold: Scalars['Int']['output'];
};

export type UpdateAddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadUrlResponse = {
  __typename: 'UploadUrlResponse';
  key: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type User = {
  __typename: 'User';
  addresses?: Maybe<Array<Address>>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type OrderStatus =
  | 'AWAITING_PAYMENT'
  | 'CANCELLED'
  | 'CONFIRMED'
  | 'DELIVERED'
  | 'PAYMENT_FAILED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED';

export type UserRole =
  | 'ADMIN'
  | 'USER';

export type GetAdminCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminCategoriesQuery = { categories: Array<{ __typename: 'Category', id: string, name: string, parent: { __typename: 'Category', id: string } | null }> };

export type CreateCategoryMutationVariables = Exact<{
  name: string;
  description?: string | null | undefined;
  parentId?: string | number | null | undefined;
}>;


export type CreateCategoryMutation = { createCategory: { __typename: 'Category', id: string, name: string, parent: { __typename: 'Category', id: string } | null } };

export type UpdateCategoryMutationVariables = Exact<{
  id: string | number;
  name?: string | null | undefined;
  description?: string | null | undefined;
  isActive?: boolean | null | undefined;
}>;


export type UpdateCategoryMutation = { updateCategory: { __typename: 'Category', id: string, name: string, parent: { __typename: 'Category', id: string } | null } };

export type RemoveCategoryMutationVariables = Exact<{
  id: string | number;
}>;


export type RemoveCategoryMutation = { removeCategory: boolean };

export type GetCustomersQueryVariables = Exact<{
  search?: string | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type GetCustomersQuery = { customers: Array<{ __typename: 'CustomerProfile', totalOrders: number, totalSpent: number, lastOrderAt: string | null, user: { __typename: 'User', id: string, email: string, name: string, role: UserRole, isActive: boolean, createdAt: string, updatedAt: string, addresses: Array<{ __typename: 'Address', id: string, street: string, city: string, country: string, postalCode: string | null, isDefault: boolean, createdAt: string }> | null } }> };

export type GetAdminOrdersQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type GetAdminOrdersQuery = { orders: Array<{ __typename: 'Order', id: string, status: OrderStatus, totalAmount: number, createdAt: string, items: Array<{ __typename: 'OrderItem', id: string, productId: string, quantity: number, unitPrice: number }> }> };

export type ExportOrdersQueryVariables = Exact<{
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  status?: OrderStatus | null | undefined;
}>;


export type ExportOrdersQuery = { exportOrders: Array<{ __typename: 'Order', id: string, userId: string, status: OrderStatus, totalAmount: number, createdAt: string, items: Array<{ __typename: 'OrderItem', productId: string, quantity: number, unitPrice: number }> }> };

export type GetAdminProductsPageQueryVariables = Exact<{
  limit: number;
  offset: number;
  search?: string | null | undefined;
  sortBy?: string | null | undefined;
  sortOrder?: string | null | undefined;
}>;


export type GetAdminProductsPageQuery = { adminProducts: { __typename: 'PaginatedProducts', total: number, hasMore: boolean, items: Array<{ __typename: 'Product', id: string, name: string, price: number, stock: number, lowStockThreshold: number, isActive: boolean, imageUrls: Array<string>, category: { __typename: 'Category', id: string, name: string } }> } };

export type GetCustomerQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCustomerQuery = { customer: { __typename: 'CustomerProfile', totalOrders: number, totalSpent: number, lastOrderAt: string | null, user: { __typename: 'User', id: string, email: string, name: string, role: UserRole, isActive: boolean, createdAt: string, updatedAt: string, addresses: Array<{ __typename: 'Address', id: string, street: string, city: string, country: string, postalCode: string | null, isDefault: boolean, createdAt: string }> | null } } };

export type GetCustomerOrdersQueryVariables = Exact<{
  userId?: string | number | null | undefined;
  limit?: number | null | undefined;
}>;


export type GetCustomerOrdersQuery = { orders: Array<{ __typename: 'Order', id: string, status: OrderStatus, totalAmount: number, createdAt: string, items: Array<{ __typename: 'OrderItem', id: string, productId: string, quantity: number, unitPrice: number }> }> };

export type DeactivateUserMutationVariables = Exact<{
  id: string | number;
}>;


export type DeactivateUserMutation = { deactivateUser: { __typename: 'User', id: string, isActive: boolean } };

export type GetDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardStatsQuery = { dashboardStats: { __typename: 'DashboardStats', totalRevenue: number, revenueThisMonth: number, revenueLastMonth: number, totalOrders: number, pendingOrders: number, totalProducts: number, lowStockProducts: number, totalCustomers: number } };

export type GetRevenueChartQueryVariables = Exact<{
  days?: number | null | undefined;
}>;


export type GetRevenueChartQuery = { revenueChart: Array<{ __typename: 'RevenueDataPoint', date: string, revenue: number, orderCount: number }> };

export type GetTopProductsQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type GetTopProductsQuery = { topProducts: Array<{ __typename: 'TopProduct', totalSold: number, totalRevenue: number, product: { __typename: 'Product', id: string, name: string } }> };

export type GetRecentOrdersQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type GetRecentOrdersQuery = { orders: Array<{ __typename: 'Order', id: string, status: OrderStatus, totalAmount: number, createdAt: string }> };

export type GetLowStockDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLowStockDashboardQuery = { lowStockProducts: Array<{ __typename: 'Product', id: string, name: string, stock: number, lowStockThreshold: number }> };

export type GetProductForEditQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductForEditQuery = { product: { __typename: 'Product', id: string, name: string, description: string | null, price: number, stock: number, imageUrls: Array<string>, category: { __typename: 'Category', id: string, name: string } } };

export type CreateProductMutationVariables = Exact<{
  name: string;
  description?: string | null | undefined;
  price: number;
  stock: number;
  categoryId: string | number;
  imageKeys: Array<string> | string;
}>;


export type CreateProductMutation = { createProduct: { __typename: 'Product', id: string, name: string } };

export type UpdateProductMutationVariables = Exact<{
  id: string | number;
  name?: string | null | undefined;
  description?: string | null | undefined;
  price?: number | null | undefined;
  stock?: number | null | undefined;
  categoryId?: string | number | null | undefined;
  imageKeys?: Array<string> | string | null | undefined;
  isActive?: boolean | null | undefined;
}>;


export type UpdateProductMutation = { updateProduct: { __typename: 'Product', id: string, name: string } };

export type PlaceOrderMutationVariables = Exact<{
  shippingAddressId: string | number;
}>;


export type PlaceOrderMutation = { placeOrder: { __typename: 'Order', id: string, status: OrderStatus, totalAmount: number, createdAt: string } };

export type CreateCheckoutSessionMutationVariables = Exact<{
  orderId: string | number;
}>;


export type CreateCheckoutSessionMutation = { createCheckoutSession: string };

export type MeForCheckoutQueryVariables = Exact<{ [key: string]: never; }>;


export type MeForCheckoutQuery = { me: { __typename: 'User', id: string, addresses: Array<{ __typename: 'Address', id: string, isDefault: boolean }> | null } };

export type GetMyOrderQueryVariables = Exact<{
  id: string | number;
}>;


export type GetMyOrderQuery = { myOrder: { __typename: 'Order', id: string, status: OrderStatus, totalAmount: number, createdAt: string, updatedAt: string, items: Array<{ __typename: 'OrderItem', id: string, productId: string, quantity: number, unitPrice: number }> } };

export type CancelMyOrderMutationVariables = Exact<{
  id: string | number;
}>;


export type CancelMyOrderMutation = { cancelMyOrder: { __typename: 'Order', id: string, status: OrderStatus, updatedAt: string } };

export type GetMyOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyOrdersQuery = { myOrders: Array<{ __typename: 'Order', id: string, status: OrderStatus, totalAmount: number, createdAt: string, items: Array<{ __typename: 'OrderItem', id: string, quantity: number, unitPrice: number }> }> };

export type GetProductQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductQuery = { product: { __typename: 'Product', id: string, name: string, description: string | null, price: number, imageUrls: Array<string>, averageRating: number, reviewCount: number, category: { __typename: 'Category', id: string, name: string }, relatedProducts: Array<{ __typename: 'Product', id: string, name: string, price: number, imageUrls: Array<string> }> } };

export type AddressFieldsFragment = { __typename: 'Address', id: string, street: string, city: string, country: string, postalCode: string | null, isDefault: boolean, createdAt: string };

export type GetMyAddressesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyAddressesQuery = { myAddresses: Array<{ __typename: 'Address', id: string, street: string, city: string, country: string, postalCode: string | null, isDefault: boolean, createdAt: string }> };

export type AddAddressMutationVariables = Exact<{
  street: string;
  city: string;
  country: string;
  postalCode?: string | null | undefined;
  isDefault: boolean;
}>;


export type AddAddressMutation = { addAddress: { __typename: 'Address', id: string, street: string, city: string, country: string, postalCode: string | null, isDefault: boolean, createdAt: string } };

export type RemoveAddressMutationVariables = Exact<{
  id: string | number;
}>;


export type RemoveAddressMutation = { removeAddress: boolean };

export type SetDefaultAddressMutationVariables = Exact<{
  id: string | number;
}>;


export type SetDefaultAddressMutation = { setDefaultAddress: { __typename: 'Address', id: string, street: string, city: string, country: string, postalCode: string | null, isDefault: boolean, createdAt: string } };

export type UpdateOrderStatusMutationVariables = Exact<{
  id: string | number;
  status: OrderStatus;
}>;


export type UpdateOrderStatusMutation = { updateOrderStatus: { __typename: 'Order', id: string, status: OrderStatus } };

export type GetCategoriesForFormQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesForFormQuery = { categories: Array<{ __typename: 'Category', id: string, name: string }> };

export type RemoveProductMutationVariables = Exact<{
  id: string | number;
}>;


export type RemoveProductMutation = { removeProduct: boolean };

export type BulkUpdateProductsMutationVariables = Exact<{
  ids: Array<string | number> | string | number;
  isActive: boolean;
}>;


export type BulkUpdateProductsMutation = { bulkUpdateProducts: number };

export type BulkDeleteProductsMutationVariables = Exact<{
  ids: Array<string | number> | string | number;
}>;


export type BulkDeleteProductsMutation = { bulkDeleteProducts: number };

export type RequestUploadUrlMutationVariables = Exact<{
  filename: string;
  contentType: string;
}>;


export type RequestUploadUrlMutation = { requestProductUploadUrl: { __typename: 'UploadUrlResponse', uploadUrl: string, key: string } };

export type GetMyCartQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyCartQuery = { myCart: { __typename: 'CartType', total: number, items: Array<{ __typename: 'CartItemType', productId: string, quantity: number, subtotal: number, product: { __typename: 'Product', id: string, name: string, price: number, imageUrls: Array<string> } | null }> } };

export type AddToCartMutationVariables = Exact<{
  productId: string | number;
  quantity: number;
}>;


export type AddToCartMutation = { addToCart: boolean };

export type RemoveFromCartMutationVariables = Exact<{
  productId: string | number;
}>;


export type RemoveFromCartMutation = { removeFromCart: boolean };

export type UpdateCartItemQuantityMutationVariables = Exact<{
  productId: string | number;
  quantity: number;
}>;


export type UpdateCartItemQuantityMutation = { updateCartItemQuantity: boolean };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { categories: Array<{ __typename: 'Category', id: string, name: string, parent: { __typename: 'Category', id: string } | null }> };

export type GetProductsQueryVariables = Exact<{
  limit: number;
  offset: number;
  categoryId?: string | number | null | undefined;
  search?: string | null | undefined;
  sortBy?: string | null | undefined;
  sortOrder?: string | null | undefined;
}>;


export type GetProductsQuery = { products: { __typename: 'PaginatedProducts', total: number, hasMore: boolean, items: Array<{ __typename: 'Product', id: string, name: string, description: string | null, price: number, imageUrls: Array<string>, category: { __typename: 'Category', id: string, name: string } }> } };

export type GetProductReviewsQueryVariables = Exact<{
  productId: string | number;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type GetProductReviewsQuery = { productReviews: Array<{ __typename: 'Review', id: string, userId: string, rating: number, comment: string | null, createdAt: string }> };

export type CreateReviewMutationVariables = Exact<{
  productId: string | number;
  orderId: string | number;
  rating: number;
  comment?: string | null | undefined;
}>;


export type CreateReviewMutation = { createReview: { __typename: 'Review', id: string, rating: number, comment: string | null, createdAt: string } };

export type GetMyOrdersForReviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyOrdersForReviewQuery = { myOrders: Array<{ __typename: 'Order', id: string, status: OrderStatus, items: Array<{ __typename: 'OrderItem', productId: string }> }> };

export type GetMyWishlistQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyWishlistQuery = { myWishlist: Array<{ __typename: 'Product', id: string, name: string, price: number, imageUrls: Array<string> }> };

export type AddToWishlistMutationVariables = Exact<{
  productId: string | number;
}>;


export type AddToWishlistMutation = { addToWishlist: boolean };

export type RemoveFromWishlistMutationVariables = Exact<{
  productId: string | number;
}>;


export type RemoveFromWishlistMutation = { removeFromWishlist: boolean };
