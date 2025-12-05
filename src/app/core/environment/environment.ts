export const environment = {
  apiBaseUrl: 'https://foody.huma-volve.com',
  endpoints: {
    auth: {
      register: '/api/register',
      verifyRegisterOtp: '/api/verify-otp',
      resendOtp: '/api/Identity/Accounts/resend-otp',
      login: '/api/login',
      logout: '/api/logout',
      forgotPassword: '/api/forgot-password',
      resetPassword: '/api/reset-password',
    },
    categories: {
      getCategories: '/api/categories?search=',
    },
    dishes: {
      getDishes: (categoryId: number) => `/api/categories/${categoryId}/dishes?search=`,
      recommended: '/api/recommended',
    },
    profile: {
      getProfile: '/api/me',
      updateProfile: '/api/profile',
    },
    favorite: {
      myFavorite: '/api/favorites',
      toggleFavorite: (id: number) => `/api/favorite/${id}`,
    },
    cart: {
      addToCart: (dishId: number) => `/api/cart/${dishId}`,
      myCart: '/api/cart',
      
    },
  },
};
