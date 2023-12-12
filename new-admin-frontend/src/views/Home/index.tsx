import { withStyles } from '@material-ui/core'

// papers
import MostVisitedPages from '../../components/Papers/AnalyticsPagesPaper'
import LastOrdersPaper from '../../components/Papers/LastOrdersPaper'
import MostSearchedPaper from '../../components/Papers/MostSearchedPaper'
import NumbersPaper from '../../components/Papers/MyNumbersPaper'
import OportunitysPaper from '../../components/Papers/OportunitysPaper'
import UsersPaper from '../../components/Papers/TotalUsersPaper'
import ScrapsAndWarnings from '../../components/ScrapsAndWarnings'

import CustomComponent from '../../components/CustomComponent'
import { NotificationCustomer } from '../../components/NotificationCustomer'
import { AnalyticsProvider } from '../../context/AnalyticsContext'
import { BillboardProvider } from '../../context/BillboardContext'
import NotificationContext from '../../context/NotificationContext'
import { OrderProvider } from '../../context/OrderContext'
import { StoreConsumer } from '../../context/StoreContext'
import Plan from '../../interfaces/plan'
import customerxService from '../../services/customerx.service'
import styles from './styles'

type HomeProps = {
  classes: any
  plan?: Plan
}

class Home extends CustomComponent<HomeProps> {
  static contextType = NotificationContext
  context!: React.ContextType<typeof NotificationContext>

  state = {
    sideBarOpen: false,
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes, plan } = this.props
    const { notification } = this.context

    return (
      <StoreConsumer>
        {({ store }) => (
          <AnalyticsProvider>
            <OrderProvider>
              <div style={{ marginBottom: '20px' }}>
                <NotificationCustomer />
              </div>

              <div className={classes.row}>
                <UsersPaper store={store} />
                {this.canSeeComponent(['pro', 'enterprise', 'pro-generic'], plan) && <NumbersPaper />}
                <MostVisitedPages store={store} />
                <OportunitysPaper store={store} />
                <div className={classes.fullGridRow}>
                  <MostSearchedPaper store={store} />
                </div>
                <div
                  style={{
                    overflow: 'hidden',
                    width: '100%',
                  }}
                >
                  <BillboardProvider>
                    <ScrapsAndWarnings />
                  </BillboardProvider>
                </div>
                {this.canSeeComponent(['pro', 'enterprise', 'pro-generic'], plan) && (
                  <LastOrdersPaper notification={notification} />
                )}
              </div>
            </OrderProvider>
          </AnalyticsProvider>
        )}
      </StoreConsumer>
    )
  }
}

export default withStyles(styles)(Home)
