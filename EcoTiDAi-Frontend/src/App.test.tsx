import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './pages/App';
import { createRootStore } from 'stores';

const store = createRootStore()

test('renders learn react link', () => {
  render(<App store={store} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
