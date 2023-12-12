
import { StartupSkeleton } from './components/StartupSkeleton'
import AuthContext, { AuthProvider } from './contexts/auth.context'
import AppContainer from './containers/App'

function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ isStarted }) => (isStarted ? <AppContainer /> : <StartupSkeleton />)}
      </AuthContext.Consumer>
    </AuthProvider>
  )
}

export default App
