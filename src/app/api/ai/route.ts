import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    // Remplacer la clé API en dur par process.env.GEMINI_API_KEY
    // Ajouter un commentaire : Ajouter GEMINI_API_KEY=... dans .env.local
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée' },
        { status: 500 }
      );
    }

    // Préparer le prompt
    const userMessage = context ? `${context}\n\nQuestion: ${message}` : message;

    // Appel à l'API Gemini (Google AI)
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
                { text: userMessage }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur API Gemini:', errorData);
      return NextResponse.json(
        { error: 'Erreur lors de la communication avec Gemini AI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({
      response: geminiText,
      usage: null
    });
  } catch (err) {
    console.error('Erreur détaillée /api/ai :', err); // LOG DEBUG
    return NextResponse.json({ error: 'Erreur serveur Gemini' }, { status: 500 });
  }
} 