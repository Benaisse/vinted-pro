import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { category, period = '30d' } = await request.json();
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Catégorie requise' },
        { status: 400 }
      );
    }
    
    // Remplacer la clé API en dur par process.env.GEMINI_API_KEY
    // Ajouter un commentaire : Ajouter GEMINI_API_KEY=... dans .env.local
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = `Insights marché Vinted pour la catégorie ${category} sur la période ${period}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const insights = JSON.parse(text);
    return NextResponse.json({
      success: true,
      data: insights,
      usage: null
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse du marché (Gemini)' },
      { status: 500 }
    );
  }
} 