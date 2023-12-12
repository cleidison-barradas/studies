import React, { lazy, Suspense } from 'react'
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'
import { Address } from '../pages/Address'
import { Home } from '../pages/Home'
import { ExchangesAndReturns, Policy } from '../pages/Institutional'
import { RecoverPassword } from '../pages/RecoverPassword'
import { UserAddress } from '../pages/UserAddress'

const Product = lazy(() => import('../pages/Product'))
const Login = lazy(() => import('../pages/Login'))
const Profile = lazy(() => import('../pages/Profile'))
const EditProfile = lazy(() => import('../pages/EditProfile'))
const LoginSocialCallback = lazy(() => import('../pages/LoginSocialCallback'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Register = lazy(() => import('../pages/Register'))
const Category = lazy(() => import('../pages/Category'))
const OrderHistory = lazy(() => import('../pages/OrderHistory'))
const OrderDetail = lazy(() => import('../pages/OrderDetail'))
const Aboutus = lazy(() => import('../pages/AboutUs'))
const NotFound = lazy(() => import('../pages/NotFound'))

export const Routes: React.FC = () => {
  return (
    <Suspense fallback={<div />}>
      <RouterRoutes>
        <Route path="*" element={<Navigate to="/produtos" />} />
        <Route path="/produtos" element={<Home />} />
        <Route path="/produtos/:slug" element={<Product />} />
        <Route path="departamentos" element={<Category />}>
          <Route path=":categoryName" element={<Category />} />
          <Route path=":categoryName/:subCategoryName" element={<Category />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit/profile" element={<EditProfile />} />
        <Route path="/user">
          <Route path="address" element={<UserAddress />} />
          <Route path="address/:addressId" element={<Address />} />
        </Route>
        <Route path="/autenticacao" element={<LoginSocialCallback />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sobre" element={<Aboutus />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/politicas-de-privacidade" element={<Policy />} />
        <Route path="/trocas-e-devolucoes" element={<ExchangesAndReturns />} />
        <Route path="/pedidos" element={<OrderHistory />} />
        <Route path="/pedido/:orderId" element={<OrderDetail />} />
        <Route path="/recuperar-senha" element={<RecoverPassword />}>
          <Route path=":token" element={<RecoverPassword />} />
        </Route>
      </RouterRoutes>
    </Suspense>
  )
}
