export const SITE_URL = 'https://waumail.my';
export const CONSOLE_URL = 'https://console.waumail.my';
export const CONTACT_EMAIL = 'hello@waumail.my';

// Mirrors platform/g8mail-app/database/seeders/PlanSeeder.php. Prices in ringgit,
// `null` means unlimited, members excludes the owner. Update both together.
// The seeder's `features` (webhooks, audit_export) are not built and stay off the site.
export const PLANS = [
    { name: 'Free', for: 'Try Wau, no card needed.', monthly: 0, annual: 0, workspaces: 1, inboxes: 3, messages: 500, members: 1, retention: 7 },
    { name: 'Solo', for: 'Solo developers, side projects, freelancers.', monthly: 19, annual: 190, workspaces: 1, inboxes: 10, messages: 5000, members: 1, retention: 30 },
    { name: 'Team', for: 'Small teams shipping every week.', monthly: 49, annual: 490, workspaces: 3, inboxes: 25, messages: 25000, members: 5, retention: 90, recommended: true },
    { name: 'Business', for: 'Agencies and larger organisations.', monthly: 149, annual: 1490, workspaces: null, inboxes: null, messages: null, members: null, retention: 365 },
] as const;

export const rm = (n: number) => `RM ${n.toLocaleString('en-MY', { maximumFractionDigits: 2 })}`;
export const count = (n: number | null) => (n === null ? 'Unlimited' : n.toLocaleString('en-MY'));
