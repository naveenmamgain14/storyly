import { useEffect, useState } from 'react'
import {
  analyticsApi,
  type AnalyticsOverview,
  type StoryAnalytics,
  type DailyAnalytics,
} from '@/services/api'

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}

export function Analytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [stories, setStories] = useState<StoryAnalytics[]>([])
  const [daily, setDaily] = useState<DailyAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [o, s, d] = await Promise.all([
          analyticsApi.overview(),
          analyticsApi.byStory(),
          analyticsApi.daily(),
        ])
        if (cancelled) return
        setOverview(o)
        setStories(s)
        setDaily(d)
      } catch {
        if (!cancelled) setError('Could not load analytics')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading analytics…</div>
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>

  const peak = Math.max(1, ...daily.map((d) => d.IMPRESSION))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">
          {overview?.uniqueDevices ?? 0} devices · {overview?.sessions ?? 0} sessions
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Shown in the rail" value={String(overview?.impressions ?? 0)} hint="impressions" />
        <Stat
          label="Opened"
          value={String(overview?.views ?? 0)}
          hint={`${overview?.openRate ?? 0}% of those shown`}
        />
        <Stat
          label="Watched to the end"
          value={String(overview?.completions ?? 0)}
          hint={`${overview?.completionRate ?? 0}% of those opened`}
        />
        <Stat label="Button taps" value={String(overview?.ctaTaps ?? 0)} hint="CTA clicks" />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Last 14 days</h2>
        {daily.length === 0 ? (
          <p className="text-sm text-gray-500">No activity recorded yet.</p>
        ) : (
          <div className="space-y-1.5">
            {daily.map((d) => (
              <div key={d.day} className="flex items-center gap-3 text-xs">
                <span className="w-20 text-gray-500 flex-shrink-0">{d.day.slice(5)}</span>
                <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${(d.IMPRESSION / peak) * 100}%` }}
                  />
                </div>
                <span className="w-32 text-right text-gray-600 flex-shrink-0">
                  {d.IMPRESSION} shown · {d.VIEW} opened
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">By story</h2>
        {stories.length === 0 ? (
          <p className="text-sm text-gray-500">No story activity yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="pb-2 pr-3">Story</th>
                  <th className="pb-2 px-2 text-right">Shown</th>
                  <th className="pb-2 px-2 text-right">Opened</th>
                  <th className="pb-2 px-2 text-right">Finished</th>
                  <th className="pb-2 px-2 text-right">Left early</th>
                  <th className="pb-2 px-2 text-right">Taps</th>
                  <th className="pb-2 pl-2 text-right">Completion</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s.storyId} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-3">
                      <span className="font-medium text-gray-900">{s.title}</span>
                      {s.status !== 'PUBLISHED' && (
                        <span className="ml-2 text-xs text-orange-600">{s.status}</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-600">{s.impressions}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{s.views}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{s.completions}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{s.dismissals}</td>
                    <td className="py-2 px-2 text-right text-gray-600">{s.ctaTaps}</td>
                    <td className="py-2 pl-2 text-right">
                      <span
                        className={
                          s.completionRate >= 50
                            ? 'text-green-600 font-medium'
                            : s.completionRate >= 25
                              ? 'text-orange-600'
                              : 'text-red-600'
                        }
                      >
                        {s.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
