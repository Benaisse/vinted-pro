import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "URL de l'image requise" },
        { status: 400 }
      );
    }
    
    // Remplacer la clé API en dur par process.env.GEMINI_API_KEY
    // Ajouter un commentaire : Ajouter GEMINI_API_KEY=... dans .env.local
    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = `Analyse photo Vinted : ${imageUrl}`;
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
    const analysis = JSON.parse(text);
    return NextResponse.json({
      success: true,
      data: analysis,
      usage: null
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erreur lors de l'analyse de photo (Gemini)" },
      { status: 500 }
    );
  }
} 