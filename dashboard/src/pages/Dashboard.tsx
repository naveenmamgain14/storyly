import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyticsApi, storiesApi, type AnalyticsOverview, type Story } from '@/services/api'

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}

export function Dashboard() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [o, s] = await Promise.all([analyticsApi.overview(), storiesApi.getAll()])
        if (cancelled) return
        setOverview(o)
        setStories(s)
      } catch {
        // Leave the zeros in place rather than inventing numbers.
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const recent = stories.slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat
              label="Total Stories"
              value={String(overview?.totalStories ?? 0)}
              hint={`${overview?.publishedStories ?? 0} published`}
            />
            <Stat label="Opens" value={String(overview?.views ?? 0)} hint="stories opened" />
            <Stat
              label="Completion Rate"
              value={`${overview?.completionRate ?? 0}%`}
              hint="watched to the end"
            />
            <Stat
              label="Button Taps" value={String(overview?.ctaTaps ?? 0)}
              hint={`${overview?.uniqueDevices ?? 0} devices`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Recent Stories</h2>
                <Link to="/stories" className="text-xs text-blue-600 hover:underline">
                  Manage
                </Link>
              </div>
              {recent.length === 0 ? (
                <p className="text-sm text-gray-500">No stories yet</p>
              ) : (
                <ul className="space-y-2">
                  {recent.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 truncate pr-3">{s.title}</span>
                      <span
                        className={`text-xs flex-shrink-0 ${
                          s.status === 'PUBLISHED' ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {s.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Reach</h2>
                <Link to="/analytics" className="text-xs text-blue-600 hover:underline">
                  Details
                </Link>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Shown in the rail</dt>
                  <dd className="text-gray-900">{overview?.impressions ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Opened</dt>
                  <dd className="text-gray-900">
                    {overview?.views ?? 0}{' '}
                    <span className="text-gray-400">({overview?.openRate ?? 0}%)</span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Watched to the end</dt>
                  <dd className="text-gray-900">{overview?.completions ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Left early</dt>
                  <dd className="text-gray-900">{overview?.dismissals ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Sessions</dt>
                  <dd className="text-gray-900">{overview?.sessions ?? 0}</dd>
                </div>
              </dl>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
