import { NextRequest, NextResponse } from 'next/server';
import { getClaudeService } from '@/services/claudeAI';

export async function GET(request: NextRequest) {
  try {
    const claudeService = getClaudeService();
    const stats = claudeService.getUsageStats();
    const cacheStats = claudeService.getCacheStats();
    
    return NextResponse.json({
      success: true,
      data: {
        usage: stats,
        cache: cacheStats
      }
    });

  } catch (error) {
    console.error('Usage stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération des statistiques' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const claudeService = getClaudeService();
    claudeService.clearCache();
    
    return NextResponse.json({
      success: true,
      message: 'Cache vidé avec succès'
    });

  } catch (error) {
    console.error('Clear cache error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors du vidage du cache' 
      },
      { status: 500 }
    );
  }
} 