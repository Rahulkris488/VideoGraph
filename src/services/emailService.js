import emailjs from '@emailjs/browser';

// ============================================
// EmailJS Configuration
// ============================================
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID;
const EMAILJS_PROVIDER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_PROVIDER_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const PROVIDER_EMAIL = import.meta.env.VITE_PROVIDER_EMAIL;

/**
 * Build flat params that map 1:1 to {{placeholders}} in the EmailJS template.
 */
function buildParams(bookingData) {
    const { selectedPack, selectedDate, selectedTime, personalDetails, propertyDetails } = bookingData;

    // Format date
    const appointment_date = selectedDate
        ? new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
        : 'Not selected';

    // Join includes array
    const includes = selectedPack?.includes
        ? (Array.isArray(selectedPack.includes)
            ? selectedPack.includes.join(', ')
            : String(selectedPack.includes))
        : 'N/A';

    // Phone with country code
    const client_phone = personalDetails?.countryCode && personalDetails?.phone
        ? personalDetails.countryCode + ' ' + personalDetails.phone
        : (personalDetails?.phone || 'N/A');

    // Full name
    const client_name = [personalDetails?.firstName, personalDetails?.lastName]
        .filter(Boolean).join(' ') || 'N/A';

    const params = {
        package_name: selectedPack?.name || 'N/A',
        duration: selectedPack?.duration || 'N/A',
        description: selectedPack?.description || 'N/A',
        includes: includes,
        appointment_date: appointment_date,
        appointment_time: selectedTime || 'N/A',
        client_name: client_name,
        client_phone: client_phone,
        client_email: personalDetails?.email || 'N/A',
        address: propertyDetails?.address || 'N/A',
        sqft: propertyDetails?.sqft || 'N/A',
        brokerage: propertyDetails?.brokerage || 'N/A',
        lockbox: propertyDetails?.lockbox || 'N/A',
        lockbox_pin: propertyDetails?.lockboxPin || 'N/A',
        access_notes: propertyDetails?.accessNotes || 'N/A',
        listing_date: propertyDetails?.listingDate || 'N/A',
    };

    return params;
}

/**
 * Send confirmation email to the customer
 */
export async function sendCustomerEmail(bookingData) {
    const data = buildParams(bookingData);

    const templateParams = {
        ...data,
        to_email: bookingData.personalDetails.email,
        to_name: data.client_name,
        subject: 'Booking Confirmation - ' + data.package_name,
    };

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_CUSTOMER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        return result;
    } catch (error) {
        console.error('❌ Customer email FAILED');
        console.error('❌ Error:', error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error text:', error?.text);
        throw error;
    }
}

/**
 * Send notification email to the service provider
 */
export async function sendProviderEmail(bookingData) {
    const data = buildParams(bookingData);

    const templateParams = {
        ...data,
        to_email: PROVIDER_EMAIL,
        to_name: 'Savage Media Team',
        from_name: data.client_name,
        from_email: bookingData.personalDetails.email,
        subject: 'New Booking Request - ' + data.package_name,
    };

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_PROVIDER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        return result;
    } catch (error) {
        console.error('❌ Provider email FAILED');
        console.error('❌ Error:', error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error text:', error?.text);
        throw error;
    }
}

/**
 * Send both emails
 */
export async function sendBookingEmails(bookingData) {
    const results = await Promise.allSettled([
        sendCustomerEmail(bookingData),
        sendProviderEmail(bookingData),
    ]);

    const output = {
        customerSent: results[0].status === 'fulfilled',
        providerSent: results[1].status === 'fulfilled',
        errors: results
            .filter(r => r.status === 'rejected')
            .map(r => r.reason),
    };

    return output;
}
