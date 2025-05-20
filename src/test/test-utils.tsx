import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

// Create a custom render function that includes providers
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
};

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const testQueryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <BrowserRouter>
        <QueryClientProvider client={testQueryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </BrowserRouter>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    testQueryClient,
  };
}

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { renderWithProviders as render };
