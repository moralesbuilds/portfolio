import { describe, expect, it } from 'vitest';
import { renderContactNotificationEmail } from './contact_notification_email';

describe('renderContactNotificationEmail', () => {
  const baseInput = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hello, I have a question about your product.',
    submittedAt: '2026-09-26T12:00:00Z',
  };

  it('renders the expected HTML layout correctly', () => {
    const html = renderContactNotificationEmail(baseInput);
    expect(html).toMatchSnapshot();
  });

  it('escapes dynamic input values to prevent XSS vulnerabilities', () => {
    const maliciousInput = {
      name: '<script>alert("XSS")</script>',
      email: 'jane+<test>@example.com',
      message: '<img src="x" onerror="alert(1)">',
      submittedAt: '<b>Today</b>',
    };

    const html = renderContactNotificationEmail(maliciousInput);

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<b>');
    
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');
  });

  it('correctly populates mailto link attributes and body contents', () => {
    const html = renderContactNotificationEmail(baseInput);

    expect(html).toContain('href="mailto:jane@example.com"');
    expect(html).toContain('Jane Doe');
    expect(html).toContain('Hello, I have a question about your product.');
    expect(html).toContain('2026-09-26T12:00:00Z');
  });

  it('handles empty string inputs gracefully', () => {
    const emptyInput = {
      name: '',
      email: '',
      message: '',
      submittedAt: '',
    };

    const html = renderContactNotificationEmail(emptyInput);

    expect(html).toContain('href="mailto:"');
    expect(html).toContain('<strong>Name:</strong> </td>');
  });
});