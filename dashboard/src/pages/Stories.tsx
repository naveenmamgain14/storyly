import { useState, useEffect } from 'react'
import { storiesApi, Story } from '../services/api'

interface MediaUpload {
  id: string
  type: 'image' | 'video'
  url: string
  file: File
}

export function Stories() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [uploadedFile, setUploadedFile] = useState<MediaUpload | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load stories from backend on mount
  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      setLoading(true)
      const data = await storiesApi.getAll()
      console.log('Loaded stories:', JSON.stringify(data, null, 2))
      setStories(data)
    } catch (err) {
      console.error('Failed to load stories:', err)
      setError('Failed to load stories from backend')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedFile({
        id: Date.now().toString(),
        type: mediaType,
        url: event.target?.result as string,
        file: file,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSaveStory = async (publish: boolean = false) => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    if (!uploadedFile) {
      alert('Please upload a media file')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await storiesApi.create({
        title,
        description,
        status: publish ? 'PUBLISHED' : 'DRAFT',
        file: uploadedFile.file,
      })

      // Reset form
      setTitle('')
      setDescription('')
      setUploadedFile(null)
      setShowCreateForm(false)

      // Reload stories
      await loadStories()

      alert(`Story ${publish ? 'published' : 'saved as draft'} successfully!`)
    } catch (err) {
      console.error('Failed to save story:', err)
      alert('Failed to save story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteStory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return

    try {
      setLoading(true)
      await storiesApi.delete(id)
      await loadStories()
    } catch (err) {
      console.error('Failed to delete story:', err)
      alert('Failed to delete story')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: 'DRAFT' | 'PUBLISHED') => {
    try {
      setLoading(true)
      const newStatus = currentStatus === 'DRAFT' ? 'PUBLISHED' : 'DRAFT'
      await storiesApi.updateStatus(id, newStatus)
      await loadStories()
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
            <p className="text-sm text-gray-600 mt-1">
              {stories.length} total • Backend connected ✅
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-purple-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-purple-700 transition"
          >
            {showCreateForm ? 'Cancel' : '+ Create Story'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Create New Story</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter story title"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter story description (optional)"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Media Type *
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      value="image"
                      checked={mediaType === 'image'}
                      onChange={(e) =>
                        setMediaType(e.target.value as 'image' | 'video')
                      }
                      className="mr-1.5"
                    />
                    Image
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      value="video"
                      checked={mediaType === 'video'}
                      onChange={(e) =>
                        setMediaType(e.target.value as 'image' | 'video')
                      }
                      className="mr-1.5"
                    />
                    Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Upload {mediaType === 'image' ? 'Image' : 'Video'} *
                </label>
                <input
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileUpload}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                />
                {uploadedFile && (
                  <div className="mt-2">
                    {mediaType === 'image' ? (
                      <img
                        src={uploadedFile.url}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border border-gray-200"
                      />
                    ) : (
                      <video
                        src={uploadedFile.url}
                        className="w-32 h-20 object-cover rounded border border-gray-200"
                        controls
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleSaveStory(false)}
                  disabled={loading}
                  className="px-4 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSaveStory(true)}
                  disabled={loading}
                  className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : 'Publish Story'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">All Stories</h2>

          {loading && !showCreateForm && (
            <p className="text-gray-500 text-center py-4 text-sm">Loading stories...</p>
          )}

          {!loading && stories.length === 0 && (
            <p className="text-gray-500 text-center py-4 text-sm">
              No stories yet. Create your first story!
            </p>
          )}

          <div className="space-y-2">
            {stories.map((story) => {
              // Get the first item's image for thumbnail
              const thumbnailUrl = story.items?.[0]?.media?.cdnUrl

              return (
                <div
                  key={story.id}
                  className="border border-gray-200 rounded p-3 hover:shadow-md transition"
                >
                  <div className="flex gap-3 items-center">
                    {/* Thumbnail Image */}
                    <div className="flex-shrink-0">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={story.title}
                          className="w-12 h-12 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            console.error('Image failed to load:', thumbnailUrl)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded border border-purple-200 flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-600">
                            {story.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Story Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {story.title}
                      </h3>
                      <div className="flex gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
                        <span>{story.items?.length || 0} items</span>
                        <span>•</span>
                        <span>
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span
                          className={`font-medium ${
                            story.status === 'PUBLISHED'
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }`}
                        >
                          {story.status}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleStatus(story.id, story.status)}
                        disabled={loading}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {story.status === 'DRAFT' ? 'Publish' : 'Unpublish'}
                      </button>
                      <button
                        onClick={() => deleteStory(story.id)}
                        disabled={loading}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
