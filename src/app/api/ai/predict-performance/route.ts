import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();
    // Remplacer la clé API en dur par process.env.GEMINI_API_KEY
    // Ajouter un commentaire : Ajouter GEMINI_API_KEY=... dans .env.local
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = `Prédiction de performance Vinted :\n${JSON.stringify(itemData)}`;
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
    const prediction = JSON.parse(text);
    return NextResponse.json({
      success: true,
      data: prediction,
      usage: null
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erreur lors de la prédiction de performance (Gemini)" },
      { status: 500 }
    );
  }
} 