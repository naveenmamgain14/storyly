import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const storyController = {
  // Get all stories (for dashboard)
  async getAll(req: Request, res: Response) {
    try {
      const stories = await prisma.story.findMany({
        include: {
          items: {
            include: {
              media: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: stories
      });
    } catch (error) {
      console.error('Get stories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stories'
      });
    }
  },

  // Get single story
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const story = await prisma.story.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              media: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!story) {
        return res.status(404).json({
          success: false,
          error: 'Story not found'
        });
      }

      res.json({
        success: true,
        data: story
      });
    } catch (error) {
      console.error('Get story error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch story'
      });
    }
  },

  // Create new story
  async create(req: Request, res: Response) {
    try {
      const { title, description, items, status = 'DRAFT' } = req.body;

      // Validate input
      if (!title || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Title and at least one item are required'
        });
      }

      // Get the first user as creator (temporary - should come from auth)
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        return res.status(500).json({
          success: false,
          error: 'No users found in database'
        });
      }

      // Create story with items
      const story = await prisma.story.create({
        data: {
          title,
          description: description || '',
          status,
          createdById: firstUser.id,
          items: {
            create: items.map((item: any, index: number) => ({
              type: item.type?.toUpperCase() || 'IMAGE',
              media: {
                connect: { id: item.mediaId }
              },
              duration: item.duration || 5,
              actionUrl: item.action_url,
              actionText: item.action_text,
              order: item.order !== undefined ? item.order : index
            }))
          }
        },
        include: {
          items: {
            include: {
              media: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: story
      });
    } catch (error) {
      console.error('Create story error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create story'
      });
    }
  },

  // Update story
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      const story = await prisma.story.update({
        where: { id },
        data: {
          title,
          description,
          status
        },
        include: {
          items: {
            include: {
              media: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });

      res.json({
        success: true,
        data: story
      });
    } catch (error) {
      console.error('Update story error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update story'
      });
    }
  },

  // Delete story
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Delete story items first (cascade)
      await prisma.storyItem.deleteMany({
        where: { storyId: id }
      });

      // Delete story
      await prisma.story.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Story deleted successfully'
      });
    } catch (error) {
      console.error('Delete story error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete story'
      });
    }
  },

  // Publish story
  async publish(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const story = await prisma.story.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date()
        },
        include: {
          items: {
            include: {
              media: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });

      res.json({
        success: true,
        data: story
      });
    } catch (error) {
      console.error('Publish story error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to publish story'
      });
    }
  }
};
