import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    
    // Vérifier que la clé API est présente
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API Claude non configurée' },
        { status: 500 }
      );
    }

    // Préparer le prompt avec le contexte Vinted
    const systemPrompt = `Tu es un assistant spécialisé dans l'aide aux vendeurs Vinted. Tu peux aider avec :
    - Analyse des tendances de vente
    - Conseils de pricing
    - Optimisation des descriptions
    - Stratégies de vente
    - Analyse de la concurrence
    - Conseils sur les photos
    - Gestion du stock
    
    Réponds toujours en français de manière professionnelle et utile.`;

    const userMessage = context ? `${context}\n\nQuestion: ${message}` : message;

    // Appel à l'API Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur API Claude:', errorData);
      return NextResponse.json(
        { error: 'Erreur lors de la communication avec Claude AI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      response: data.content[0].text,
      usage: data.usage
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 