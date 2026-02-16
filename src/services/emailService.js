import emailjs from '@emailjs/browser';

// ============================================
// EmailJS Configuration
// Replace these with your actual EmailJS credentials
// Sign up at https://www.emailjs.com (free tier: 200 emails/month)
// ============================================
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'YOUR_CUSTOMER_TEMPLATE_ID';
const EMAILJS_PROVIDER_TEMPLATE_ID = 'YOUR_PROVIDER_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Service provider email — receives booking notifications
const PROVIDER_EMAIL = 'provider@savagemedia.com';

/**
 * Format booking data into a readable email body
 */
function formatBookingDetails(bookingData) {
    const { selectedPack, selectedDate, selectedTime, personalDetails, propertyDetails } = bookingData;

    const dateStr = selectedDate
        ? new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
        : 'Not selected';

    return `
═══════════════════════════════════════
        BOOKING CONFIRMATION
═══════════════════════════════════════

SERVICE PACKAGE
───────────────────────────────────────
Package: ${selectedPack?.name || 'N/A'}
Duration: ${selectedPack?.duration || 'N/A'}
Description: ${selectedPack?.description || 'N/A'}
Includes: ${selectedPack?.includes?.join(', ') || 'N/A'}

APPOINTMENT DETAILS
───────────────────────────────────────
Date: ${dateStr}
Time: ${selectedTime || 'N/A'}

CLIENT INFORMATION
───────────────────────────────────────
Name: ${personalDetails?.firstName || ''} ${personalDetails?.lastName || ''}
Phone: ${personalDetails?.countryCode || ''} ${personalDetails?.phone || ''}
Email: ${personalDetails?.email || ''}

PROPERTY DETAILS
───────────────────────────────────────
Approximate Sq. Ft.: ${propertyDetails?.sqft || 'N/A'}
Brokerage: ${propertyDetails?.brokerage || 'N/A'}
Lockbox: ${propertyDetails?.lockbox || 'N/A'}
Expected Listing Date: ${propertyDetails?.listingDate || 'N/A'}

═══════════════════════════════════════
  Thank you for choosing SAVAGE MEDIA
═══════════════════════════════════════
    `.trim();
}

/**
 * Send invoice/confirmation email to the customer
 */
export async function sendCustomerEmail(bookingData) {
    const details = formatBookingDetails(bookingData);

    const templateParams = {
        to_email: bookingData.personalDetails.email,
        to_name: `${bookingData.personalDetails.firstName} ${bookingData.personalDetails.lastName}`,
        subject: `Booking Confirmation — ${bookingData.selectedPack?.name}`,
        message: details,
    };

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_CUSTOMER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('Customer email sent:', result.text);
        return result;
    } catch (error) {
        console.error('Failed to send customer email:', error);
        throw error;
    }
}

/**
 * Send booking notification to the service provider
 */
export async function sendProviderEmail(bookingData) {
    const details = formatBookingDetails(bookingData);

    const templateParams = {
        to_email: PROVIDER_EMAIL,
        to_name: 'Savage Media Team',
        from_name: `${bookingData.personalDetails.firstName} ${bookingData.personalDetails.lastName}`,
        from_email: bookingData.personalDetails.email,
        subject: `New Booking Request — ${bookingData.selectedPack?.name}`,
        message: details,
    };

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_PROVIDER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('Provider email sent:', result.text);
        return result;
    } catch (error) {
        console.error('Failed to send provider email:', error);
        throw error;
    }
}

/**
 * Send both emails (customer invoice + provider notification)
 */
export async function sendBookingEmails(bookingData) {
    const results = await Promise.allSettled([
        sendCustomerEmail(bookingData),
        sendProviderEmail(bookingData),
    ]);

    const customerResult = results[0];
    const providerResult = results[1];

    return {
        customerSent: customerResult.status === 'fulfilled',
        providerSent: providerResult.status === 'fulfilled',
        errors: results
            .filter(r => r.status === 'rejected')
            .map(r => r.reason),
    };
}
