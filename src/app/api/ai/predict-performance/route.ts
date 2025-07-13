import { NextRequest, NextResponse } from 'next/server';
import { getClaudeService } from '@/services/claudeAI';

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();
    
    const claudeService = getClaudeService();
    const prediction = await claudeService.predictPerformance(itemData);
    
    return NextResponse.json({
      success: true,
      data: prediction,
      usage: claudeService.getUsageStats()
    });

  } catch (error) {
    console.error('Performance prediction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la prédiction de performance' 
      },
      { status: 500 }
    );
  }
} 