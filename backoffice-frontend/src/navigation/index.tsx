import React from 'react'

// Views
import Login from '../views/Login'
import Home from '../views/Home'
import Stores from '../views/Stores'
import NewStore from '../views/NewStore'
import Store from '../views/Store'
import StoreGroups from '../views/StoreGroups'
import StoreGroup from '../views/StoreGroup'
import NewStoreGroup from '../views/NewStoreGroup'
import Plans from '../views/Plans'
import Products from '../views/Products'
import NewProduct from '../views/NewProduct'
import UpdateProduct from '../views/UpdateProduct'
import Erps from '../views/Erps'
import Erp from '../views/Erp'
import NewErp from '../views/NewErp'
import Users from '../views/Users'
import NewUser from '../views/NewUser'
import User from '../views/User'
import Billboards from '../views/Billboards'
import NewBillboard from '../views/NewBillboard'
import Billboard from '../views/Billboard'
import ImportView from '../views/ImportHistory'
import Integration from '../views/Integration'
import StoreReportView from '../views/StoreReportView'
import SDRs from '../views/SDRs'
import NewSDR from '../views/NewSDR'
import SDR from '../views/SDR'
import Leads from '../views/Leads'
import Lead from '../views/Lead'
import StoreFlagShip from '../views/StoreFlagShip'
import StoreFlagShipDetailView from '../views/StoreFlagShipDetailView'

export type AppRoute = {
  path: string
  exact: boolean
  name: string
  isPrivate: boolean
  component: React.ComponentClass | any
}

const routes: AppRoute[] = [
  {
    path: '/',
    exact: true,
    name: 'login',
    isPrivate: false,
    component: Login,
  },
  {
    path: '/',
    exact: true,
    name: 'Home',
    isPrivate: true,
    component: Home,
  },
  {
    path: '/billboard',
    exact: true,
    name: 'Quadro de avisos',
    isPrivate: true,
    component: Billboards,
  },
  {
    path: '/billboard/:id',
    exact: true,
    name: 'Editar aviso',
    isPrivate: true,
    component: Billboard,
  },
  {
    path: '/stores',
    exact: true,
    name: 'Lojas',
    isPrivate: true,
    component: Stores,
  },
  {
    path: '/stores/:id',
    exact: true,
    name: 'Detalhes da loja',
    isPrivate: true,
    component: Store,
  },
  {
    path: '/store/new',
    exact: true,
    name: 'Criar loja',
    isPrivate: true,
    component: NewStore,
  },
  {
    path: '/store/groups',
    exact: true,
    name: 'Grupo de lojas',
    isPrivate: true,
    component: StoreGroups,
  },
  {
    path: '/store/groups/new',
    exact: true,
    name: 'Novo grupo de lojas',
    isPrivate: true,
    component: NewStoreGroup,
  },
  {
    path: '/store/groups/:id',
    exact: true,
    name: 'Detalhes do grupo',
    isPrivate: true,
    component: StoreGroup,
  },
  {
    path: '/store/headstore',
    exact: true,
    name: 'Gerenciamento de Matrizes',
    isPrivate: true,
    component: StoreFlagShip,
  },
  {
    path: '/store/headstore/:storeId',
    exact: true,
    name: 'Atualizar Matriz',
    isPrivate: true,
    component: StoreFlagShipDetailView,
  },
  {
    path: '/reports',
    exact: true,
    name: 'Relatórios',
    isPrivate: true,
    component: StoreReportView,
  },
  {
    path: '/plans',
    exact: true,
    name: 'Planos de lojas',
    isPrivate: true,
    component: Plans,
  },
  {
    path: '/products',
    exact: true,
    name: 'Produtos',
    isPrivate: true,
    component: Products,
  },
  {
    path: '/product/new',
    exact: true,
    name: 'Adicionar produto',
    isPrivate: true,
    component: NewProduct,
  },
  {
    path: '/product/:productId',
    exact: true,
    name: 'Atualizar produto',
    isPrivate: true,
    component: UpdateProduct,
  },
  {
    path: '/erps',
    exact: true,
    name: 'Ver erps',
    isPrivate: true,
    component: Erps,
  },
  {
    path: '/erps/new',
    exact: true,
    name: 'Criar erp',
    isPrivate: true,
    component: NewErp,
  },
  {
    path: '/erp/:id',
    exact: true,
    name: 'Atualizar erp',
    isPrivate: true,
    component: Erp,
  },
  {
    path: '/users',
    exact: true,
    name: 'Ver usuários',
    isPrivate: true,
    component: Users,
  },
  {
    path: '/users/new',
    exact: true,
    name: 'Cadastrar usuário',
    isPrivate: true,
    component: NewUser,
  },
  {
    path: '/users/:id',
    exact: true,
    name: 'Atualizar usuário',
    isPrivate: true,
    component: User,
  },
  {
    path: '/billboard/new',
    exact: true,
    name: 'Criar novo aviso',
    isPrivate: true,
    component: NewBillboard,
  },
  {
    path: '/imports',
    exact: true,
    name: 'Importar',
    isPrivate: true,
    component: ImportView,
  },
  {
    path: '/store/integration',
    exact: true,
    name: 'Integrações',
    isPrivate: true,
    component: Integration,
  },
  {
    path: '/sdrs',
    exact: true,
    name: "Ver SDR's",
    isPrivate: true,
    component: SDRs,
  },
  {
    path: '/sdrs/new',
    exact: true,
    name: 'Cadastrar SDR',
    isPrivate: true,
    component: NewSDR,
  },
  {
    path: '/sdrs/:id',
    exact: true,
    name: 'Atualizar SDR',
    isPrivate: true,
    component: SDR,
  },
  {
    path: '/leads',
    exact: true,
    name: "Ver Leads",
    isPrivate: true,
    component: Leads,
  },
  {
    path: '/leads/:id',
    exact: true,
    name: 'Lead',
    isPrivate: true,
    component: Lead,
  },
]

export default routes
