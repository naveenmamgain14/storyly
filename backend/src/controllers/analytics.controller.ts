import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

type Counts = Record<string, number>;

interface DailyEntry {
  day: string;
  IMPRESSION: number;
  VIEW: number;
  CLICK: number;
  COMPLETE: number;
  DISMISS: number;
}

const emptyCounts = (): Counts => ({
  IMPRESSION: 0,
  VIEW: 0,
  CLICK: 0,
  COMPLETE: 0,
  DISMISS: 0
});

const rate = (numerator: number, denominator: number): number =>
  denominator === 0 ? 0 : Math.round((numerator / denominator) * 1000) / 10;

export const analyticsController = {
  // Headline numbers for the dashboard landing page
  async overview(_req: Request, res: Response) {
    try {
      const [totalStories, publishedStories, byType, devices, sessions] = await Promise.all([
        prisma.story.count(),
        prisma.story.count({ where: { status: 'PUBLISHED' } }),
        prisma.analyticsEvent.groupBy({ by: ['eventType'], _count: { eventType: true } }),
        prisma.analyticsEvent.findMany({ select: { deviceId: true }, distinct: ['deviceId'] }),
        prisma.analyticsEvent.findMany({ select: { sessionId: true }, distinct: ['sessionId'] })
      ]);

      const counts = emptyCounts();
      byType.forEach((row) => {
        counts[row.eventType] = row._count.eventType;
      });

      res.json({
        success: true,
        data: {
          totalStories,
          publishedStories,
          impressions: counts.IMPRESSION,
          views: counts.VIEW,
          completions: counts.COMPLETE,
          dismissals: counts.DISMISS,
          ctaTaps: counts.CLICK,
          uniqueDevices: devices.length,
          sessions: sessions.length,
          // Of the stories people opened, how many were watched to the end
          completionRate: rate(counts.COMPLETE, counts.VIEW),
          // Of the stories people saw in the rail, how many they opened
          openRate: rate(counts.VIEW, counts.IMPRESSION)
        }
      });
    } catch (error) {
      console.error('Analytics overview error:', error);
      res.status(500).json({ success: false, error: 'Failed to load analytics' });
    }
  },

  // Per-story breakdown, so a weak story is visible rather than averaged away
  async byStory(_req: Request, res: Response) {
    try {
      const [grouped, stories] = await Promise.all([
        prisma.analyticsEvent.groupBy({
          by: ['storyId', 'eventType'],
          _count: { eventType: true }
        }),
        prisma.story.findMany({ select: { id: true, title: true, status: true } })
      ]);

      const titles = new Map(stories.map((s) => [s.id, s]));
      const perStory = new Map<string, Counts>();

      grouped.forEach((row) => {
        const current = perStory.get(row.storyId) ?? emptyCounts();
        current[row.eventType] = row._count.eventType;
        perStory.set(row.storyId, current);
      });

      const data = [...perStory.entries()]
        .map(([storyId, counts]) => {
          const story = titles.get(storyId);
          return {
            storyId,
            // Events outlive the story they belong to, so deleted ones still appear
            title: story?.title ?? 'Deleted story',
            status: story?.status ?? 'DELETED',
            impressions: counts.IMPRESSION,
            views: counts.VIEW,
            completions: counts.COMPLETE,
            dismissals: counts.DISMISS,
            ctaTaps: counts.CLICK,
            completionRate: rate(counts.COMPLETE, counts.VIEW),
            openRate: rate(counts.VIEW, counts.IMPRESSION)
          };
        })
        .sort((a, b) => b.views - a.views);

      res.json({ success: true, data });
    } catch (error) {
      console.error('Analytics by-story error:', error);
      res.status(500).json({ success: false, error: 'Failed to load story analytics' });
    }
  },

  // Daily totals for the last fortnight
  async daily(_req: Request, res: Response) {
    try {
      const rows = await prisma.$queryRaw<
        Array<{ day: Date; event_type: string; count: number }>
      >`
        SELECT DATE_TRUNC('day', "timestamp")::date AS day,
               "event_type"::text AS event_type,
               COUNT(*)::int AS count
        FROM analytics_events
        WHERE "timestamp" >= NOW() - INTERVAL '14 days'
        GROUP BY 1, 2
        ORDER BY 1 ASC
      `;

      const days = new Map<string, DailyEntry>();
      rows.forEach((row) => {
        const key = new Date(row.day).toISOString().slice(0, 10);
        const entry: DailyEntry =
          days.get(key) ?? { day: key, IMPRESSION: 0, VIEW: 0, CLICK: 0, COMPLETE: 0, DISMISS: 0 };
        if (row.event_type in entry) {
          (entry as unknown as Counts)[row.event_type] = Number(row.count);
        }
        days.set(key, entry);
      });

      res.json({ success: true, data: [...days.values()] });
    } catch (error) {
      console.error('Analytics daily error:', error);
      res.status(500).json({ success: false, error: 'Failed to load daily analytics' });
    }
  }
};
