import { CartProvider } from '../../contexts/cart.context'
import { MenuProvider } from '../../contexts/menu.context'
import { ScrollToTop } from '../../helpers/scrollHandler'
import { SearchProvider } from '../../contexts/search.context'
import { Routes } from '../../navigation/Routes'
import { Layout } from '../Layout'
import { Helmet } from '../../components/Helmet'
import { Analytics } from '../../components/Analytics'
import { BrowserRouter } from 'react-router-dom'
import { WaypointProvider } from '../../contexts/waypoint.context'
import { SetStoreLogo } from '../../helpers/getStoreLogoifPNG'

export default function AppContainer() {

const favicon = document.getElementById('favicon') as HTMLAnchorElement
const storelogo = ""+SetStoreLogo()

if(favicon){
  if(storelogo.length > 1) favicon.href = storelogo
}

  return (
    <BrowserRouter>
      <WaypointProvider>
        <SearchProvider>
          <CartProvider>
            <MenuProvider>
              <Layout>
                <Helmet />
                <Analytics />
                <ScrollToTop />
                <Routes />
              </Layout>
            </MenuProvider>
          </CartProvider>
        </SearchProvider>
      </WaypointProvider>
    </BrowserRouter>
  )
}
