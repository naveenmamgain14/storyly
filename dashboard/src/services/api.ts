import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

// For now, we'll use a test API key
// In production, this should come from user settings
const API_KEY = 'sk_storyly_android_app_2026'

export interface Media {
  id: string
  type: 'IMAGE' | 'VIDEO'
  filename: string
  cdnUrl: string
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
        headers: { 'X-API-Key': API_KEY },
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
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'multipart/form-data',
          },
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
          headers: { 'X-API-Key': API_KEY },
        }
      )

      return storyResponse.data.data
    } catch (error) {
      console.error('Failed to create story:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/stories/${id}`, {
        headers: { 'X-API-Key': API_KEY },
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
          headers: { 'X-API-Key': API_KEY },
        })
      } else {
        await axios.put(`${API_BASE_URL}/stories/${id}`, { status }, {
          headers: { 'X-API-Key': API_KEY },
        })
      }
    } catch (error) {
      console.error('Failed to update story status:', error)
      throw error
    }
  },
}
