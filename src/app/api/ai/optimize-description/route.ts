import { NextRequest, NextResponse } from 'next/server';
import { getClaudeService } from '@/services/claudeAI';

export async function POST(request: NextRequest) {
  try {
    const { currentDesc, itemData } = await request.json();
    
    if (!currentDesc || !itemData) {
      return NextResponse.json(
        { success: false, error: 'Description et données d\'article requises' },
        { status: 400 }
      );
    }
    
    const claudeService = getClaudeService();
    const optimization = await claudeService.optimizeDescription(currentDesc, itemData);
    
    return NextResponse.json({
      success: true,
      data: optimization,
      usage: claudeService.getUsageStats()
    });

  } catch (error) {
    console.error('Description optimization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'optimisation de description' 
      },
      { status: 500 }
    );
  }
} 