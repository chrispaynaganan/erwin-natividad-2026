import { LegalPage, type LegalSection } from '@/components/legal-page'

export const metadata = { title: 'Privacy Policy' }

const sections: LegalSection[] = [
  { heading: '1. Who we are', paragraphs: [
    'This website is operated by Erwin Natividad ("we", "us", "our"), a voiceover artist and voice coach. If you have any questions about this policy or your data, contact us at [contact email].',
  ] },
  { heading: '2. Information we collect', paragraphs: [
    'We collect information you provide directly to us, primarily through our contact form. This may include:',
  ], bullets: [
    'Your name', 'Your email address', 'Your phone number (if provided)', 'The type of inquiry and any details you include in your message',
  ] },
  { heading: '3. How we use your information', paragraphs: [
    'We use the information you provide to respond to your inquiry, discuss and deliver voiceover or coaching services, send you information you have requested, and keep records of our communications. We do not sell your personal information.',
  ] },
  { heading: '4. How your information is stored', paragraphs: [
    'Contact submissions are stored in our database hosted by Supabase. Where applicable, payment processing is handled by Stripe and email/newsletter delivery by MailerLite; these providers process data under their own privacy policies. We retain your information only as long as needed for the purposes described here or as required by law.',
  ] },
  { heading: '5. Cookies and analytics', paragraphs: [
    'We may use essential cookies needed for the site to function (for example, remembering your light/dark theme preference). If we use analytics, we will describe the tools and your choices here. [List any analytics tools used, e.g., none / privacy-friendly analytics.]',
  ] },
  { heading: '6. Your rights', paragraphs: [
    'Depending on where you live, you may have the right to access, correct, or delete the personal information we hold about you, or to object to or restrict certain processing. To make a request, contact us at [contact email]. We will respond within the timeframe required by applicable law.',
  ] },
  { heading: '7. Third-party links', paragraphs: [
    'Our site may link to external sites (for example, social media profiles). We are not responsible for the privacy practices of those sites and encourage you to review their policies.',
  ] },
  { heading: '8. Changes to this policy', paragraphs: [
    'We may update this policy from time to time. The "Last updated" date above reflects the most recent revision. Significant changes will be noted on this page.',
  ] },
  { heading: '9. Contact', paragraphs: [
    'For any privacy questions or requests, contact us at [contact email].',
  ] },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="[Month DD, YYYY]"
      intro="This Privacy Policy explains what information we collect when you use this website, how we use it, and the choices you have. By using this site or contacting us through it, you agree to the practices described below."
      sections={sections}
    />
  )
}