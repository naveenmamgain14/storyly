import axios from 'axios'

import { useAuthStore } from '@/store/authStore'

const API_BASE_URL = '/api/v1'

// No API key lives in this bundle any more: the dashboard authenticates as a
// user, so reading the JavaScript no longer grants access to the content API.
const authHeaders = (): Record<string, string> => {
  const token = useAuthStore.getState().token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// An expired or revoked session should drop straight back to the login screen
// rather than leaving the UI in a half-broken state.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export interface Media {
  id: string
  type: 'IMAGE' | 'VIDEO'
  filename: string
  cdnUrl: string
  thumbnailUrl?: string | null
  size: string
}

export interface StoryItem {
  id: string
  type: 'IMAGE' | 'VIDEO'
  duration: number
  media: Media
}

export interface Story {
  id: string
  title: string
  description?: string
  status: 'DRAFT' | 'PUBLISHED'
  items: StoryItem[]
  createdAt: string
}

// Stories API
export const storiesApi = {
  async getAll(): Promise<Story[]> {
    try {
      // Use the /stories endpoint (not /sdk/stories) for full data with nested media
      const response = await axios.get(`${API_BASE_URL}/stories`, {
        headers: authHeaders(),
      })
      console.log('API Response:', response.data)
      return response.data.data || []
    } catch (error) {
      console.error('Failed to fetch stories:', error)
      // Fallback to localStorage
      const local = localStorage.getItem('storyly_stories')
      return local ? JSON.parse(local) : []
    }
  },

  async create(data: { title: string; description?: string; status: 'DRAFT' | 'PUBLISHED'; file: File }): Promise<Story> {
    try {
      // 1. Upload media file first
      const formData = new FormData()
      formData.append('file', data.file)

      const mediaResponse = await axios.post(
        `${API_BASE_URL}/media/upload`,
        formData,
        {
          headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
        }
      )

      const mediaId = mediaResponse.data.data.id

      // 2. Create story with the uploaded media
      const storyResponse = await axios.post(
        `${API_BASE_URL}/stories`,
        {
          title: data.title,
          description: data.description || '',
          status: data.status,
          items: [
            {
              mediaId,
              type: data.file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
              duration: 5,
              order: 0,
            },
          ],
        },
        {
          headers: authHeaders(),
        }
      )

      return storyResponse.data.data
    } catch (error) {
      console.error('Failed to create story:', error)
      throw error
    }
  },

  /**
   * Full edit. Frames are passed explicitly so untouched ones keep their existing
   * media: sending only the changed frame would delete the rest, since the API
   * replaces the whole item list.
   */
  async update(
    id: string,
    data: {
      title?: string
      description?: string
      thumbnailFile?: File | null
      frames?: Array<{
        mediaId?: string
        newFile?: File | null
        type?: 'IMAGE' | 'VIDEO'
      }>
    }
  ): Promise<void> {
    try {
      const headers = authHeaders()
      const uploadHeaders = { ...headers, 'Content-Type': 'multipart/form-data' }

      const uploadFile = async (file: File): Promise<string> => {
        const form = new FormData()
        form.append('file', file)
        const res = await axios.post(`${API_BASE_URL}/media/upload`, form, {
          headers: uploadHeaders,
        })
        return res.data.data.id
      }

      const body: Record<string, unknown> = {}
      if (data.title !== undefined) body.title = data.title
      if (data.description !== undefined) body.description = data.description

      let firstMediaId: string | undefined

      if (data.frames && data.frames.length > 0) {
        const items = []
        for (let i = 0; i < data.frames.length; i++) {
          const frame = data.frames[i]
          const mediaId = frame.newFile ? await uploadFile(frame.newFile) : frame.mediaId
          if (!mediaId) continue

          const type =
            frame.newFile?.type.startsWith('video/') ? 'VIDEO' : frame.type || 'IMAGE'

          items.push({ mediaId, type, duration: 5, order: items.length })
          if (items.length === 1) firstMediaId = mediaId
        }
        if (items.length === 0) {
          throw new Error('A story needs at least one frame')
        }
        body.items = items
      }

      // The circle image hangs off the first frame's media record.
      if (data.thumbnailFile) {
        const target = firstMediaId ?? data.frames?.[0]?.mediaId
        if (target) {
          const form = new FormData()
          form.append('file', data.thumbnailFile)
          await axios.post(`${API_BASE_URL}/media/${target}/thumbnail`, form, {
            headers: uploadHeaders,
          })
        }
      }

      await axios.put(`${API_BASE_URL}/stories/${id}`, body, { headers })
    } catch (error) {
      console.error('Failed to update story:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/stories/${id}`, {
        headers: authHeaders(),
      })
    } catch (error) {
      console.error('Failed to delete story:', error)
      throw error
    }
  },

  async updateStatus(id: string, status: 'DRAFT' | 'PUBLISHED'): Promise<void> {
    try {
      if (status === 'PUBLISHED') {
        await axios.post(`${API_BASE_URL}/stories/${id}/publish`, {}, {
          headers: authHeaders(),
        })
      } else {
        await axios.put(`${API_BASE_URL}/stories/${id}`, { status }, {
          headers: authHeaders(),
        })
      }
    } catch (error) {
      console.error('Failed to update story status:', error)
      throw error
    }
  },
}
