import { mswHandlers } from '../mocks/browser'
import { useEffect, useState } from 'react'
import { MSWPresetProvider } from './context'
import { MSWPresetUI } from './components/PresetUI'

function App() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    // Example API calls
    fetch('/api/user')
      .then((res) => res.json())
      .then(setUser)

    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
  }, [])

  return (
    <MSWPresetProvider
      value={{
        handlers: mswHandlers.handlers,
        useMock: mswHandlers.useMock as any,
      }}
    >
      <div className='container mx-auto p-4'>
        <div className='mb-8'>
          <MSWPresetUI />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='rounded border p-4'>
            <h2 className='mb-2 text-xl font-bold'>User Data</h2>
            <pre className='rounded bg-gray-100 p-2'>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div className='rounded border p-4'>
            <h2 className='mb-2 text-xl font-bold'>Posts</h2>
            <pre className='rounded bg-gray-100 p-2'>
              {JSON.stringify(posts, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </MSWPresetProvider>
  )
}

export default App
