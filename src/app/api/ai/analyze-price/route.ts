import { NextRequest, NextResponse } from 'next/server';
import { getClaudeService } from '@/services/claudeAI';

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();
    
    const claudeService = getClaudeService();
    const analysis = await claudeService.analyzePrice(itemData);
    
    return NextResponse.json({
      success: true,
      data: analysis,
      usage: claudeService.getUsageStats()
    });

  } catch (error) {
    console.error('Price analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse de prix' 
      },
      { status: 500 }
    );
  }
} 