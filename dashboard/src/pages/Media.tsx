export function Media() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <button className="btn-primary">Upload Media</button>
      </div>

      <div className="card">
        <p className="text-gray-500">No media files yet. Upload your first image or video!</p>
      </div>
    </div>
  )
}
