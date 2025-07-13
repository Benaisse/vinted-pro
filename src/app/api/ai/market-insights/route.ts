import { NextRequest, NextResponse } from 'next/server';
import { getClaudeService } from '@/services/claudeAI';

export async function POST(request: NextRequest) {
  try {
    const { category, period = '30d' } = await request.json();
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Catégorie requise' },
        { status: 400 }
      );
    }
    
    const claudeService = getClaudeService();
    const insights = await claudeService.getMarketInsights(category, period);
    
    return NextResponse.json({
      success: true,
      data: insights,
      usage: claudeService.getUsageStats()
    });

  } catch (error) {
    console.error('Market insights error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse du marché' 
      },
      { status: 500 }
    );
  }
} 