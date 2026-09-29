import axios from 'axios'

const API_BASE_URL = '/api/v1'

const API_KEY = 'sk_35baf0a65c31b273ed2f9c043a49997f4769d78054128558ade21beb9380e23b'

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

  /**
   * Partial edit. Any field left out is untouched: passing only a title renames
   * the story without disturbing its media, and passing only a thumbnail keeps
   * the full image as it was.
   */
  async update(
    id: string,
    data: {
      title?: string
      description?: string
      file?: File | null
      thumbnailFile?: File | null
      currentMediaId?: string
    }
  ): Promise<void> {
    try {
      let mediaId = data.currentMediaId

      // A new full image means a new media record, which the story then points at.
      if (data.file) {
        const form = new FormData()
        form.append('file', data.file)
        const res = await axios.post(`${API_BASE_URL}/media/upload`, form, {
          headers: { 'X-API-Key': API_KEY, 'Content-Type': 'multipart/form-data' },
        })
        mediaId = res.data.data.id
      }

      // The thumbnail hangs off the media record, so it needs one to attach to.
      if (data.thumbnailFile && mediaId) {
        const form = new FormData()
        form.append('file', data.thumbnailFile)
        await axios.post(`${API_BASE_URL}/media/${mediaId}/thumbnail`, form, {
          headers: { 'X-API-Key': API_KEY, 'Content-Type': 'multipart/form-data' },
        })
      }

      const body: Record<string, unknown> = {}
      if (data.title !== undefined) body.title = data.title
      if (data.description !== undefined) body.description = data.description

      // Only send items when the image actually changed, so an untouched story
      // does not have its frames deleted and recreated for nothing.
      if (data.file && mediaId) {
        body.items = [
          {
            mediaId,
            type: data.file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
            duration: 5,
            order: 0,
          },
        ]
      }

      await axios.put(`${API_BASE_URL}/stories/${id}`, body, {
        headers: { 'X-API-Key': API_KEY },
      })
    } catch (error) {
      console.error('Failed to update story:', error)
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
