// src/routes.js
import { lazy } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const Home = lazy(() => import('./admin'));
const Product = lazy(() => import('./products'));
const Category = lazy(() => import('./categories'));
const ProductDetail = lazy(() => import('./products/detail'));
const ProductItem = lazy(() => import('./products/item'));
const CreateProduct = lazy(() => import('./products/create'));
const Order = lazy(() => import('./orders'));
const DetailOrder = lazy(() => import('./orders/detail'));
const CreateOrder = lazy(() => import('./orders/create'));
const BasicSetting = lazy(() => import('./settings/basic'));
const StatisticSetting = lazy(() => import('./settings/statistic'));
const ProfileSetting = lazy(() => import('./settings/profile'));
const User = lazy(() => import('./users'));
const Admin = lazy(() => import('./admin'));
const Login = lazy(() => import('./login'));

export const privateRoutes = [
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'products', element: <Product /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'products/item/:id', element: <ProductItem /> },
      { path: 'products/create', element: <CreateProduct /> },
      { path: 'categories', element: <Category /> },
      { path: 'orders', element: <Order /> },
      { path: 'orders/:id', element: <DetailOrder /> },
      { path: 'orders/create', element: <CreateOrder /> },
      { path: 'settings/basic', element: <BasicSetting /> },
      { path: 'settings/statistic', element: <StatisticSetting /> },
      { path: 'settings/me', element: <ProfileSetting /> },
      { path: 'users', element: <User /> },
      { path: 'me', element: <Admin /> },
    ],
  },
];

export const publicRoutes = [
  { path: '/login', element: <Login /> },
];
