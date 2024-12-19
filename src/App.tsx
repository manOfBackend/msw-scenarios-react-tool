import { handlers, profiles } from '../mocks/handlers'
import { MockManager } from './components/MockManager'
import { ThemeProvider } from './styles/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      <MockManager handlers={handlers} profiles={profiles} />
    </ThemeProvider>
  )
}

export default App
// ;<MSWTestDashboard handlers={handlers} />
