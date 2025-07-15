import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoAnalyzer } from '../PhotoAnalyzer';

describe('PhotoAnalyzer', () => {
  it('affiche le titre du composant', () => {
    render(<PhotoAnalyzer />);
    expect(screen.getByText(/analyseur de photos ai/i)).toBeInTheDocument();
  });

  it('affiche le bouton Analyser avec AI après sélection de fichier', () => {
    render(<PhotoAnalyzer />);
    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/sélectionner un fichier/i) || screen.getByLabelText(/photo/i) || screen.getByRole('textbox', { hidden: true });
    fireEvent.change(input, { target: { files: [file] } });
    // Vérifie que le bouton Analyser avec AI apparaît
    expect(screen.getByText(/analyser avec ai/i)).toBeInTheDocument();
  });

  it('affiche une erreur si aucun fichier n’est sélectionné et qu’on clique sur Analyser', async () => {
    render(<PhotoAnalyzer />);
    const button = screen.getByText(/analyser avec ai/i);
    fireEvent.click(button);
    expect(await screen.findByText(/fichier/i)).toBeInTheDocument();
  });
}); 