import { handlers, profiles } from '../mocks/handlers'
import { MockManager } from './components/MockManager'
import MSWTestDashboard from './components/MSWTestDashboard'

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <MockManager handlers={handlers} profiles={profiles} />
      <MSWTestDashboard handlers={handlers} />
    </div>
  )
}

export default App
