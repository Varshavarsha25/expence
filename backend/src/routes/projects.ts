import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            expenses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        expenses: {
          include: {
            lineItems: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Project name is required'
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description
      }
    });

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            expenses: true
          }
        }
      }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if project has associated expenses
    if (existingProject._count.expenses > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete project with associated expenses'
      });
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
  }
});

export default router;
