// schema.org JSON-LD for the site. Facts only: no ratings, reviews, user counts or SLA.
import { CONTACT_EMAIL, PLANS, SITE_URL } from './consts';

const ORG_ID = `${SITE_URL}/#organization`;

export const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Wau',
    alternateName: 'Wau by G8Suite',
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    email: CONTACT_EMAIL,
    parentOrganization: { '@type': 'Organization', name: 'G8Suite', url: 'https://g8suite.com' },
};

export const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Wau',
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
};

export const softwareApplication = {
    '@type': 'SoftwareApplication',
    name: 'Wau',
    description: 'Hosted SMTP sandbox that captures every email your app sends in development, staging and UAT, for inspection. Nothing is delivered.',
    url: SITE_URL,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    publisher: { '@id': ORG_ID },
    offers: PLANS.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        description: p.for,
        price: p.monthly,
        priceCurrency: 'MYR',
        url: `${SITE_URL}/pricing`,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: p.monthly, priceCurrency: 'MYR', unitText: 'MONTH', referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' } },
    })),
};

const stripTags = (html: string) => html.replace(/<[^>]*>/g, '');

export const faqPage = (faqs: readonly { q: string; a?: string; html?: string }[]) => ({
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a ?? stripTags(f.html ?? '') },
    })),
});
