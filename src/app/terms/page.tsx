import { LegalPage, type LegalSection } from '@/components/legal-page'

export const metadata = { title: 'Terms and Conditions' }

const sections: LegalSection[] = [
  { heading: '1. Acceptance of terms', paragraphs: [
    'By accessing or using this website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the site.',
  ] },
  { heading: '2. Use of the site', paragraphs: [
    'You may use this site for lawful purposes only. You agree not to misuse the site, attempt to disrupt its operation, or access areas you are not authorized to use.',
  ] },
  { heading: '3. Services and inquiries', paragraphs: [
    'Information on this site about voiceover and coaching services is provided for general information. Submitting a contact form or inquiry does not create a binding agreement. Any engagement is governed by a separate written agreement and quote, including scope, fees, timelines, deposit, and delivery terms.',
  ] },
  { heading: '4. Bookings, payments, and deposits', paragraphs: [
    'Where a project is agreed, a deposit may be required before work begins, with the balance due on delivery, as set out in your individual agreement. Cancellation and refund terms are described in that agreement and in the service details on this site. [Confirm your standard deposit %, cancellation window, and refund policy here.]',
  ] },
  { heading: '5. Intellectual property', paragraphs: [
    'All content on this site — including text, branding, logo, audio demos, and design — is owned by Erwin Natividad or used with permission, and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use this content without prior written consent.',
    'Ownership and licensing of delivered voiceover work (including usage rights and any commercial license) are defined in your individual project agreement.',
  ] },
  { heading: '6. Demo and sample audio', paragraphs: [
    'Audio demos and project samples on this site are provided to showcase work and may include material produced for clients. They are for evaluation only and may not be downloaded, reused, or redistributed without permission.',
  ] },
  { heading: '7. Disclaimer of warranties', paragraphs: [
    'The site is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the site will be uninterrupted, error-free, or free of harmful components.',
  ] },
  { heading: '8. Limitation of liability', paragraphs: [
    'To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of this site. [Have counsel confirm wording appropriate to your jurisdiction.]',
  ] },
  { heading: '9. Governing law', paragraphs: [
    'These terms are governed by the laws of [jurisdiction], without regard to its conflict of laws rules. Any disputes will be subject to the exclusive jurisdiction of the courts located in [jurisdiction].',
  ] },
  { heading: '10. Changes to these terms', paragraphs: [
    'We may update these terms from time to time. The "Last updated" date above reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated terms.',
  ] },
  { heading: '11. Contact', paragraphs: [
    'Questions about these terms can be sent to [contact email].',
  ] },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      lastUpdated="[Month DD, YYYY]"
      intro="These Terms and Conditions govern your use of this website. Please read them carefully."
      sections={sections}
    />
  )
}