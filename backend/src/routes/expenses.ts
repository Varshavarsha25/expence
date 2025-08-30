import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/expenses - Get all expenses with line items
router.get('/', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        lineItems: true,
        projectRef: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expenses'
    });
  }
});

// GET /api/expenses/:id - Get single expense by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        lineItems: true,
        projectRef: true
      }
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense'
    });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const {
      date,
      project,
      payee,
      referenceNo,
      lineItems,
      subtotal,
      totalDiscount,
      totalTax,
      grandTotal
    } = req.body;

    // Validate required fields
    if (!date || !project || !payee) {
      return res.status(400).json({
        success: false,
        error: 'Date, project, and payee are required'
      });
    }

    // Validate line items ensuring required numeric fields exist
    const cleanedLineItems = Array.isArray(lineItems) ? lineItems.map((item, idx) => {
      const errors: string[] = [];
      if (item.rate === undefined || item.rate === null || isNaN(Number(item.rate))) errors.push('rate');
      if (item.amount === undefined || item.amount === null || isNaN(Number(item.amount))) errors.push('amount');
      if (!item.description) errors.push('description');
      if (errors.length) {
        return { __invalid: true, idx, errors } as any;
      }
      return {
        description: String(item.description),
        quantity: item.quantity ? Number(item.quantity) : 1,
        rate: Number(item.rate),
        discount: item.discount ? Number(item.discount) : 0,
        tax: item.tax ? Number(item.tax) : 0,
        amount: Number(item.amount)
      };
    }) : [];

    const invalids = cleanedLineItems.filter((i: any) => i.__invalid);
    if (invalids.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid line items',
        details: invalids.map((i: any) => ({ index: i.idx, missing: i.errors }))
      });
    }

    const expense = await prisma.expense.create({
      data: {
        date: new Date(date),
        project,
        payee,
        referenceNo,
        subtotal: subtotal || 0,
        totalDiscount: totalDiscount || 0,
        totalTax: totalTax || 0,
        grandTotal: grandTotal || 0,
        lineItems: {
          create: cleanedLineItems
        }
      },
      include: {
        lineItems: true
      }
    });

    res.status(201).json({
      success: true,
      data: expense,
      message: 'Expense created successfully'
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create expense'
    });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      project,
      payee,
      referenceNo,
      lineItems,
      subtotal,
      totalDiscount,
      totalTax,
      grandTotal
    } = req.body;

    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    // Delete existing line items and create new ones
    await prisma.lineItem.deleteMany({
      where: { expenseId: id }
    });

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        project,
        payee,
        referenceNo,
        subtotal: subtotal || 0,
        totalDiscount: totalDiscount || 0,
        totalTax: totalTax || 0,
        grandTotal: grandTotal || 0,
        lineItems: {
          create: lineItems?.map((item: any) => ({
            description: item.description,
            quantity: item.quantity || 1,
            rate: item.rate,
            discount: item.discount || 0,
            tax: item.tax || 0,
            amount: item.amount
          })) || []
        }
      },
      include: {
        lineItems: true
      }
    });

    res.json({
      success: true,
      data: expense,
      message: 'Expense updated successfully'
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update expense'
    });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    // Delete expense (line items will be deleted automatically due to cascade)
    await prisma.expense.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete expense'
    });
  }
});

// GET /api/expenses/stats/summary - Get expense statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalExpenses = await prisma.expense.count();
    const totalAmount = await prisma.expense.aggregate({
      _sum: {
        grandTotal: true
      }
    });

    const expensesByProject = await prisma.expense.groupBy({
      by: ['project'],
      _count: {
        id: true
      },
      _sum: {
        grandTotal: true
      }
    });

    res.json({
      success: true,
      data: {
        totalExpenses,
        totalAmount: totalAmount._sum.grandTotal || 0,
        expensesByProject
      }
    });
  } catch (error) {
    console.error('Error fetching expense stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense statistics'
    });
  }
});

export default router;
