import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Loading } from './loading';
import { type Size } from '@/types';
import { NextIntlClientProvider } from 'next-intl';

function renderLoading(size: Size | undefined = undefined, className: string | undefined = undefined) {
  render(
    <NextIntlClientProvider locale="en" messages={{ root: { loading: "Loading" } }}>
      <Loading size={size} className={className} />
    </NextIntlClientProvider>
  );
}

describe('Loading', () => {
  test('exposes an accessible loading status', () => {
    renderLoading();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  test('renders three dots', () => {
    renderLoading();
    const status = screen.getByRole('status');
    expect(status.children).toHaveLength(3);
  });

  test('staggers the animation delay on the first two dots', () => {
    renderLoading();

    const [first, second, third] = [...screen.getByRole('status').children];
    expect(first).toHaveClass('[animation-delay:-0.3s]');
    expect(second).toHaveClass('[animation-delay:-0.15s]');
    expect(third.className).not.toMatch(/animation-delay/);
  });

  test('merges a custom className onto the wrapper', () => {
    renderLoading(undefined, "text-red-500");
    expect(screen.getByRole('status')).toHaveClass('inline-flex', 'shrink-0', 'items-center', 'text-red-500');
  });

  const cases: [Size, string][] = [
    ['sm', 'h-1.5'],
    ['md', 'h-3'],
    ['lg', 'h-5'],
  ] as const;
  test.each(cases)("applies wrapper size classes for size=%s", (size, expected) => {
    renderLoading(size);

    const [first, second, third] = [...screen.getByRole('status').children];
    expect(first).toHaveClass(expected);
    expect(second).toHaveClass(expected);
    expect(third).toHaveClass(expected);
  });
});
