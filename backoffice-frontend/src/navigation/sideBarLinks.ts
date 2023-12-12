import InfoCartIcon from '../assets/images/icons/sidebar/infoCart.svg'
import ControlPanelIcon from '../assets/images/icons/sidebar/controlPanelIcon.svg'
import BriefcaseIcon from '../assets/images/icons/sidebar/briefcase-solid.svg'
import CatalogIcon from '../assets/images/icons/sidebar/catalogIcon.svg'
import ErpIcon from '../assets/images/icons/sidebar/erp.svg'
import UserIcon from '../assets/images/icons/sidebar/userIcon.svg'
import CloudUploader from '../assets/images/cloud-upload.png'

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
        title: 'Quadro de avisos',
        exact: true,
        icon: ControlPanelIcon,
        path: '/billboard',
    },
    {
        title: 'Lojas',
        icon: InfoCartIcon,
        children: [
            {
                path: '/stores',
                title: 'Ver lojas',
                exact: false,
            },
            {
                path: '/store/new',
                title: 'Criar nova loja',
                exact: true,
            },
            {
                path: '/store/groups',
                title: 'Grupos de lojas',
                exact: true,
            },
            {
                path: '/store/groups/new',
                title: 'Criar grupo de lojas',
                exact: true,
            },
            {
                path: '/store/integration',
                title: 'Integração',
                exact: true,
            },
            {
                path: '/store/headstore',
                title: 'Gerenciamento de Matriz',
                exact: true,
            },
        ],
    },
    {
        title: 'Produtos',
        icon: CatalogIcon,
        children: [
            {
                path: '/products',
                title: 'Ver Produtos',
                exact: true,
            },
            {
                path: '/product/new',
                title: 'Criar novo produto',
                exact: true,
            },
        ],
    },
    {
        title: 'ERP',
        icon: ErpIcon,
        children: [
            {
                path: '/erps',
                title: 'Ver ERPs',
                exact: true,
            },
            {
                path: '/erps/new',
                title: 'Criar novo ERP',
                exact: true,
            },
        ],
    },
    {
        title: 'Usuários',
        icon: UserIcon,
        children: [
            {
                path: '/users',
                title: 'Ver usuários',
                exact: true,
            },
            {
                path: '/users/new',
                title: 'Cadastrar usuário',
                exact: true,
            },
            {
                path: '/leads',
                title: "Ver Leads",
                exact: true,
            },
            {
                path: '/sdrs',
                title: "Ver SDR's",
                exact: true,
            },
            {
                path: '/sdrs/new',
                title: 'Cadastrar SDR',
                exact: true,
            },
        ],
    },
    {
        title: 'Planos',
        exact: true,
        icon: BriefcaseIcon,
        path: '/plans',
    },
    {
        title: 'Importações por arquivo',
        exact: true,
        icon: CloudUploader,
        path: '/imports',
    }
]
export default links
