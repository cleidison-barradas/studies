import BrushIcon from '../assets/images/brush.svg'
import CatalogIcon from '../assets/images/catalogIcon.svg'
import ControlPanelIcon from '../assets/images/controlPanelIcon.svg'
import CreditCardIcon from '../assets/images/credit-card.svg'
import DeliveryIcon from '../assets/images/deliveryIcon.svg'
import DownloadsIcon from '../assets/images/downloadsIcon.svg'
import { default as CustomerIcon, default as EditIcon } from '../assets/images/editIcon.svg'
import FinancialIcon from '../assets/images/financialIcon.svg'
import HandoutIcon from '../assets/images/handout.svg'
import MarketingIcon from '../assets/images/marketing.svg'
import SuportIcon from '../assets/images/suportIcon.svg'
import WebmailIcon from '../assets/images/webMailIcon.svg'
import AppStoreIcon from '../assets/images/appStore.svg'

export interface ChildrenLink {
  path: string
  title: string
  exact?: boolean
}

export interface SideBarLink {
  title: string
  icon: any
  exact?: boolean
  external?: string
  path?: string
  children?: ChildrenLink[]
}

const links: SideBarLink[] = [
  {
    title: 'Painel de Controle',
    icon: ControlPanelIcon,
    path: '/',
    exact: true,
  },
  {
    title: 'Dados da loja',
    icon: EditIcon,
    children: [
      {
        path: '/store/data',
        title: 'Dados de cadastro',
      },
      {
        path: '/store/aboutus',
        title: 'Sobre nós',
      },
      {
        path: '/store/filiais',
        title: 'Filiais',
      },
    ],
  },
  {
    title: 'Pagamentos',
    icon: CreditCardIcon,
    children: [
      {
        path: '/payments/config',
        title: 'Configurações de pagamento',
      },
      {
        path: '/payments/link',
        title: 'Link de pagamento',
      },
    ],
  },
  {
    title: 'Financeiro',
    icon: FinancialIcon,
    path: '/financial',
  },
  {
    title: 'Sobre entrega',
    icon: DeliveryIcon,
    path: '/delivery/config',
  },
  {
    title: 'Aparência da loja',
    icon: BrushIcon,
    path: '/store/layout',
  },
  {
    title: 'Produtos',
    icon: CatalogIcon,
    children: [
      {
        path: '/products',
        title: 'Produtos',
      },
      {
        path: '/showcase',
        title: 'Vitrine',
      },
      {
        path: '/import/history',
        title: 'Importação por arquivo',
      },
      {
        path: '/categories',
        title: 'Categorias',
      },
      {
        path: '/integration/status',
        title: 'Integrações',
      },
    ],
  },
  {
    title: 'Pedidos',
    icon: HandoutIcon,
    children: [
      {
        path: '/sales/list',
        title: 'Histórico de vendas',
      },
      {
        path: '/ifood/list',
        title: 'Histórico do iFood',
      },
    ],
  },

  {
    title: 'Clientes',
    icon: CustomerIcon,
    path: '/customers',
  },

  {
    title: 'Marketing',
    icon: MarketingIcon,
    children: [
      {
        path: '/marketing/integration',
        title: 'Integrações',
      },
      {
        path: '/marketing/promotions',
        title: 'Promoções',
      },
      {
        path: '/marketing/cupons',
        title: 'Cupons',
      },
    ],
  },
  {
    title: 'AppStore',
    icon: AppStoreIcon,
    path: '/appstore',
  },
  {
    title: 'Webmail',
    icon: WebmailIcon,
    external: 'https://webmail.mypharma.com.br',
    path: '/webmail',
  },
  {
    title: 'Central de Ajuda',
    icon: SuportIcon,
    external: 'https://mypharmasupport.zendesk.com/hc/pt-br',
    path: '/suport',
  },
  {
    title: 'Downloads',
    icon: DownloadsIcon,
    path: '/downloads',
  },
]

export default links
