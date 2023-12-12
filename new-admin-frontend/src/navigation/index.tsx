import React from 'react'

// Views
import AboutUs from '../views/AboutUs'
import ChangePassword from '../views/ChangePassword'
import ChooseTenant from '../views/ChooseTenant'
import DeliveryConfig from '../views/DeliveryConfig'
import EditShowcase from '../views/EditShowcase'
import Home from '../views/Home'
import ImportView from '../views/ImportView'
import ImportingHistory from '../views/ImportingHistory'
import Login from '../views/Login'
import Products from '../views/Products'
import Recover from '../views/RecoverPassword'
import Recovered from '../views/Recovered'
import ShowCase from '../views/ShowCase'
import StoreData from '../views/StoreData'
import StoreLayout from '../views/StoreLayout'
// Category
import AddCategory from '../views/AddCategory'
import Categorys from '../views/Categorys'
import EditCategory from '../views/EditCategory'

import AddProduct from '../views/AddProduct'
import AddPromotion from '../views/AddPromotion'
import CustomerDetail from '../views/CustomerDetail'
import Customers from '../views/Customers'
import Downloads from '../views/Downloads'
import EditProducts from '../views/EditProducts'
import EpharmaPromotion from '../views/EpharmaPromotion'
import FinancialView from '../views/Financial'
import MarketingAutomations from '../views/MarketingAutomations'
import MarketingCoupom from '../views/MarketingCoupom'
import MarketingEmail from '../views/MarketingEmail'
import MarketingIntegration from '../views/MarketingIntegration'
import MarketingPromotion from '../views/MarketingPromotion'
import NewPaymentLink from '../views/NewPaymentLink'
import PaymentConfig from '../views/PaymentConfig'
import PaymentLink from '../views/PaymentLink'
import SalesHistory from '../views/SalesHistory'
import StatusIntegration from '../views/StatusIntegration'
import StoreBranch from '../views/StoreBranchView'
import TextBanner from '../views/TextBanner'
import UpdateMockups from '../views/UpdateMockups'
import UpdateOrderView from '../views/UpdateOrderView'
import UpdateProduct from '../views/UpdateProduct'
import EditPromotion from '../views/UpdateProductPromotion'
import iFoodHistory from '../views/iFoodHistory'
import { VirtulStock } from '../views/AppStore/VirtualStock'

export type AppRoute = {
  path: string
  exact: boolean
  name?: string
  isPrivate: boolean
  component: React.ComponentClass | any
}

const routes: AppRoute[] = [
  {
    path: '/',
    exact: true,
    isPrivate: false,
    name: 'MyPharma - Autenticação',
    component: Login,
  },
  {
    path: '/recover/password',
    exact: true,
    isPrivate: false,
    name: 'MyPharma - Recuperar Senha',
    component: Recover,
  },
  {
    path: '/recovered',
    exact: true,
    isPrivate: false,
    name: 'MyPharma - Senha alterada com sucesso',
    component: Recovered,
  },
  {
    path: '/change/password',
    exact: true,
    isPrivate: false,
    name: 'MyPharma - Trocar Senha',
    component: ChangePassword,
  },
  {
    path: '/tenant',
    exact: true,
    isPrivate: false,
    name: 'MyPharma - Escolher loja',
    component: ChooseTenant,
  },
  {
    path: '/',
    exact: true,
    isPrivate: true,
    name: 'Home',
    component: Home,
  },
  {
    path: '/store/data',
    exact: true,
    isPrivate: true,
    name: 'Store data',
    component: StoreData,
  },
  {
    path: '/store/layout',
    exact: true,
    isPrivate: true,
    name: 'Store data',
    component: StoreLayout,
  },
  {
    path: '/appstore/virtualstock',
    exact: true,isPrivate: true,
    name: 'Estoque Virtual',
    component: VirtulStock
  },
  {
    path: '/store/layout/text-banner',
    exact: true,
    isPrivate: true,
    component: TextBanner,
  },
  {
    path: '/store/aboutus',
    exact: true,
    isPrivate: true,
    name: 'About us',
    component: AboutUs,
  },
  {
    path: '/store/filiais',
    exact: true,
    isPrivate: true,
    component: StoreBranch,
  },
  {
    path: '/delivery/config',
    exact: true,
    isPrivate: true,
    name: 'Delivery config',
    component: DeliveryConfig,
  },
  {
    path: '/products',
    exact: true,
    isPrivate: true,
    name: 'Products',
    component: Products,
  },
  {
    path: '/products/mockups',
    exact: true,
    isPrivate: true,
    name: 'EditMockups',
    component: UpdateMockups,
  },
  {
    path: '/products/add',
    exact: true,
    isPrivate: true,
    name: 'Products',
    component: AddProduct,
  },
  {
    path: '/products/:id',
    exact: true,
    isPrivate: true,
    name: 'Products',
    component: UpdateProduct,
  },
  {
    path: '/showcase',
    exact: true,
    isPrivate: true,
    name: 'showcase',
    component: ShowCase,
  },
  {
    path: '/showcase/edit/:id',
    exact: true,
    isPrivate: true,
    name: 'EditShowcase',
    component: EditShowcase,
  },
  {
    path: '/import/history',
    exact: true,
    isPrivate: true,
    name: 'ImportingHistory',
    component: ImportingHistory,
  },
  {
    path: '/import/:id',
    exact: true,
    isPrivate: true,
    name: 'ImportingHistory',
    component: ImportView,
  },
  {
    path: '/categories',
    exact: true,
    isPrivate: true,
    component: Categorys,
  },
  {
    path: '/category/add',
    exact: true,
    isPrivate: true,
    component: AddCategory,
  },
  {
    path: '/category/:categoryId',
    exact: true,
    isPrivate: true,
    component: EditCategory,
  },
  {
    path: '/integration/status',
    exact: true,
    isPrivate: true,
    component: StatusIntegration,
  },
  {
    path: '/sales',
    exact: false,
    isPrivate: true,
    component: SalesHistory,
  },
  {
    path: '/sale/:orderId',
    exact: false,
    isPrivate: true,
    component: UpdateOrderView,
  },
  {
    path: '/customers',
    exact: true,
    isPrivate: true,
    component: Customers,
  },
  {
    path: '/customers/:_id',
    exact: true,
    isPrivate: true,
    component: CustomerDetail,
  },
  {
    path: '/marketing/integration',
    exact: true,
    isPrivate: true,
    component: MarketingIntegration,
  },
  {
    path: '/downloads',
    exact: true,
    isPrivate: true,
    component: Downloads,
  },
  {
    path: '/marketing/promotions',
    exact: true,
    isPrivate: true,
    component: MarketingPromotion,
  },
  {
    path: '/marketing/promotions/add',
    exact: true,
    isPrivate: true,
    component: AddPromotion,
  },
  {
    path: '/marketing/promotions/:promotionId',
    exact: true,
    isPrivate: true,
    component: EditPromotion,
  },
  {
    path: '/product/editor',
    exact: true,
    isPrivate: true,
    component: EditProducts,
  },
  {
    path: '/marketing/cupons',
    exact: true,
    isPrivate: true,
    component: MarketingCoupom,
  },
  {
    path: '/marketing/automations',
    exact: true,
    isPrivate: true,
    component: MarketingAutomations,
  },
  {
    path: '/marketing/automations/email',
    exact: true,
    isPrivate: true,
    component: MarketingEmail,
  },
  {
    path: '/payments',
    exact: true,
    isPrivate: true,
    component: PaymentConfig,
  },
  {
    path: '/televendas',
    exact: true,
    isPrivate: true,
    component: PaymentLink,
  },

  {
    path: '/televendas/add',
    exact: true,
    isPrivate: true,
    component: NewPaymentLink,
  },
  {
    path: '/ifood/:orderCod?/:orderId?',
    exact: true,
    isPrivate: true,
    component: iFoodHistory,
  },
  {
    path: '/epharma',
    exact: true,
    isPrivate: true,
    component: EpharmaPromotion,
  },
  {
    path: '/financial',
    exact: true,
    isPrivate: true,
    component: FinancialView,
  },
]

export default routes
