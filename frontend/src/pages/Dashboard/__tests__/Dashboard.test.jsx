import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';  // Ensure you are using the correct import path
import { vi } from 'vitest';

// Mock socket.io client correctly
vi.mock('socket.io-client', () => {
  return {
    io: vi.fn().mockReturnValue({
      on: vi.fn(),
    }),
  };
});

describe('Dashboard', () => {
  it('renders with connecting status', () => {
    render(<Dashboard />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('displays temperature on socket update', () => {
    render(<Dashboard />);
    const socketUpdate = vi.fn();
    socketUpdate({ temperature: 25, status: 'HIGH' });
    expect(screen.getByText('25°C')).toBeInTheDocument();
  });
});
