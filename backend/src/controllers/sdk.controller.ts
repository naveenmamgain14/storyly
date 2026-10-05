import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { storyCache } from '../lib/storyCache';

const prisma = new PrismaClient();

const lastTouched = new Map<string, number>();
const TOUCH_INTERVAL_MS = 60_000;

function touchKeyOccasionally(id: string): void {
  const now = Date.now();
  if (now - (lastTouched.get(id) ?? 0) < TOUCH_INTERVAL_MS) return;
  lastTouched.set(id, now);
  prisma.apiKey
    .update({ where: { id }, data: { lastUsedAt: new Date() } })
    .catch(() => { /* best effort, never fail a request over this */ });
}

export const sdkController = {
  // Get stories for SDK consumption
  getStories: async (req: Request, res: Response) => {
    try {
      const { user_id, collection_id } = req.query;
      const apiKey = req.apiKey; // Set by validateApiKey middleware

      // The response does not vary by API key — every key sees the same
      // published stories — so collection is the only thing worth keying on.
      const cacheKey = `sdk:stories:${collection_id ?? 'all'}`;
      const cached = storyCache.get(cacheKey);
      if (cached) {
        return res.json({ success: true, data: cached, cached: true });
      }

      const stories = await prisma.story.findMany({
        where: {
          status: 'PUBLISHED',
          ...(collection_id && { collectionId: collection_id as string })
        },
        include: {
          items: {
            include: {
              media: true
            },
            orderBy: {
              order: 'asc'
            }
          },
          collection: true
        },
        orderBy: {
          order: 'asc'
        }
      });

      // Transform to SDK response format
      const transformedStories = stories.map(story => ({
        id: story.id,
        title: story.title,
        description: story.description,
        collection_id: story.collectionId,
        published_at: story.publishedAt,
        order: story.order,
        thumbnail_url: story.items[0]?.media.thumbnailUrl || story.items[0]?.media.cdnUrl,
        items: story.items.map(item => ({
          id: item.id,
          story_id: item.storyId,
          type: item.type.toLowerCase(),
          media_url: item.media.cdnUrl,
          thumbnail_url: item.media.thumbnailUrl,
          duration: item.duration,
          action_url: item.actionUrl,
          action_text: item.actionText,
          order: item.order
        }))
      }));

      storyCache.set(cacheKey, transformedStories);

      res.json({
        success: true,
        data: transformedStories
      });
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stories'
      });
    }
  },

  // Get collections for SDK
  getCollections: async (req: Request, res: Response) => {
    try {
      const collections = await prisma.collection.findMany({
        include: {
          stories: {
            where: {
              status: 'PUBLISHED'
            },
            include: {
              items: {
                include: {
                  media: true
                },
                orderBy: {
                  order: 'asc'
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      });

      res.json({
        success: true,
        data: collections
      });
    } catch (error) {
      console.error('Error fetching collections:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch collections'
      });
    }
  },

  // Track single analytics event
  trackEvent: async (req: Request, res: Response) => {
    try {
      const {
        event_type,
        story_id,
        story_item_id,
        user_id,
        device_id,
        session_id,
        metadata
      } = req.body;

      const apiKey = req.apiKey;

      await prisma.analyticsEvent.create({
        data: {
          eventType: event_type.toUpperCase(),
          storyId: story_id,
          storyItemId: story_item_id,
          userId: user_id,
          deviceId: device_id,
          appId: apiKey!.appId,
          sessionId: session_id,
          metadata: metadata || {}
        }
      });

      // lastUsedAt is a coarse signal, so writing it on every event batch is
      // a round trip spent for nothing. Fire it off without blocking, and at
      // most once a minute per key.
      touchKeyOccasionally(apiKey!.id);

      res.json({
        success: true,
        message: 'Event tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking event:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track event'
      });
    }
  },

  // Track batch analytics events
  trackEventsBatch: async (req: Request, res: Response) => {
    try {
      const { events } = req.body;
      const apiKey = req.apiKey;

      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Events must be a non-empty array'
        });
      }

      await prisma.analyticsEvent.createMany({
        data: events.map((event: any) => ({
          eventType: event.event_type.toUpperCase(),
          storyId: event.story_id,
          storyItemId: event.story_item_id,
          userId: event.user_id,
          deviceId: event.device_id,
          appId: apiKey!.appId,
          sessionId: event.session_id,
          metadata: event.metadata || {}
        }))
      });

      res.json({
        success: true,
        message: `${events.length} events tracked successfully`
      });
    } catch (error) {
      console.error('Error tracking events batch:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track events'
      });
    }
  }
};
