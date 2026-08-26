export function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600">Total Stories</p>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600">Published</p>
          <p className="text-3xl font-bold mt-2">18</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-3xl font-bold mt-2">12.4K</p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <p className="text-3xl font-bold mt-2">68%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Stories</h2>
          <p className="text-gray-500">No stories yet</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    </div>
  )
}
