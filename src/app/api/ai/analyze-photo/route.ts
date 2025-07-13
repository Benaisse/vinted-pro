import { NextRequest, NextResponse } from 'next/server';
import { getClaudeService } from '@/services/claudeAI';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'URL de l\'image requise' },
        { status: 400 }
      );
    }
    
    const claudeService = getClaudeService();
    const analysis = await claudeService.analyzePhoto(imageUrl);
    
    return NextResponse.json({
      success: true,
      data: analysis,
      usage: claudeService.getUsageStats()
    });

  } catch (error) {
    console.error('Photo analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse de photo' 
      },
      { status: 500 }
    );
  }
} 