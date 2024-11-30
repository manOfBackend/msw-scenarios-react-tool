import { http } from 'msw-scenarios'
import { HttpResponse } from 'msw'

export const userHandler = http
  .get('/api/user', () => {
    return HttpResponse.json({ message: 'default response' })
  })
  .presets(
    {
      label: 'success',
      status: 200,
      response: { name: 'John Doe', age: 30 },
    },
    {
      label: 'error',
      status: 404,
      response: { error: 'User not found' },
    }
  )

export const postHandler = http
  .get('/api/posts', () => {
    return HttpResponse.json({ posts: [] })
  })
  .presets(
    {
      label: 'has posts',
      status: 200,
      response: {
        posts: [
          { id: 1, title: 'First Post' },
          { id: 2, title: 'Second Post' },
        ],
      },
    },
    {
      label: 'empty',
      status: 200,
      response: { posts: [] },
    }
  )
