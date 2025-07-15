import { render, screen, fireEvent } from '@testing-library/react';
import { PriceOptimizer } from '../PriceOptimizer';

describe('PriceOptimizer', () => {
  it('affiche le titre du composant', () => {
    render(<PriceOptimizer itemData={{}} />);
    expect(screen.getByText(/optimisation de prix/i)).toBeInTheDocument();
  });

  it('affiche une erreur si on tente d’analyser sans remplir les champs', async () => {
    render(<PriceOptimizer itemData={{}} />);
    // TODO: simuler le clic sur le bouton Analyser sans remplir les champs
    // expect(await screen.findByText(/remplir tous les champs/i)).toBeInTheDocument();
  });
}); 