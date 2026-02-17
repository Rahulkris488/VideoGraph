import emailjs from '@emailjs/browser';

console.log('📦 emailService.js LOADED');

// ============================================
// EmailJS Configuration
// ============================================
const EMAILJS_SERVICE_ID = 'service_dzob1f2';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_0lroqnz';
const EMAILJS_PROVIDER_TEMPLATE_ID = 'template_qanp6c8';
const EMAILJS_PUBLIC_KEY = 'bS0r5VmlPI7Ottbfg';
const PROVIDER_EMAIL = 'rahulkrishnatp12@gmail.com';

console.log('⚙️ Config:', {
    EMAILJS_SERVICE_ID,
    EMAILJS_CUSTOMER_TEMPLATE_ID,
    EMAILJS_PROVIDER_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    PROVIDER_EMAIL,
});

/**
 * Build flat params that map 1:1 to {{placeholders}} in the EmailJS template.
 */
function buildParams(bookingData) {
    console.log('🔨 buildParams() called');
    console.log('🔨 Raw bookingData:', JSON.stringify(bookingData, null, 2));

    const { selectedPack, selectedDate, selectedTime, personalDetails, propertyDetails } = bookingData;

    console.log('🔨 Destructured:');
    console.log('   selectedPack:', selectedPack);
    console.log('   selectedDate:', selectedDate);
    console.log('   selectedTime:', selectedTime);
    console.log('   personalDetails:', personalDetails);
    console.log('   propertyDetails:', propertyDetails);

    // Format date
    const appointment_date = selectedDate
        ? new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
        : 'Not selected';
    console.log('📅 appointment_date:', appointment_date);

    // Join includes array
    const includes = selectedPack?.includes
        ? (Array.isArray(selectedPack.includes)
            ? selectedPack.includes.join(', ')
            : String(selectedPack.includes))
        : 'N/A';
    console.log('📋 includes:', includes);

    // Phone with country code
    const client_phone = personalDetails?.countryCode && personalDetails?.phone
        ? personalDetails.countryCode + ' ' + personalDetails.phone
        : (personalDetails?.phone || 'N/A');
    console.log('📞 client_phone:', client_phone);

    // Full name
    const client_name = [personalDetails?.firstName, personalDetails?.lastName]
        .filter(Boolean).join(' ') || 'N/A';
    console.log('👤 client_name:', client_name);

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
        listing_date: propertyDetails?.listingDate || 'N/A',
    };

    console.log('✅ buildParams() result:');
    Object.entries(params).forEach(([key, value]) => {
        console.log(`   ${key}: "${value}"`);
    });

    return params;
}

/**
 * Send confirmation email to the customer
 */
export async function sendCustomerEmail(bookingData) {
    console.log('════════════════════════════════════════');
    console.log('📧 sendCustomerEmail() CALLED');
    console.log('════════════════════════════════════════');

    const data = buildParams(bookingData);

    const templateParams = {
        ...data,
        to_email: bookingData.personalDetails.email,
        to_name: data.client_name,
        subject: 'Booking Confirmation - ' + data.package_name,
    };

    console.log('📧 FINAL templateParams being sent to EmailJS:');
    Object.entries(templateParams).forEach(([key, value]) => {
        console.log(`   ${key}: "${value}"`);
    });

    console.log('📧 Calling emailjs.send() with:');
    console.log('   Service ID:', EMAILJS_SERVICE_ID);
    console.log('   Template ID:', EMAILJS_CUSTOMER_TEMPLATE_ID);
    console.log('   Public Key:', EMAILJS_PUBLIC_KEY);
    console.log('   Param count:', Object.keys(templateParams).length);

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_CUSTOMER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('✅ Customer email SENT successfully');
        console.log('✅ Result:', result);
        console.log('✅ Result.text:', result.text);
        console.log('✅ Result.status:', result.status);
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
    console.log('════════════════════════════════════════');
    console.log('📧 sendProviderEmail() CALLED');
    console.log('════════════════════════════════════════');

    const data = buildParams(bookingData);

    const templateParams = {
        ...data,
        to_email: PROVIDER_EMAIL,
        to_name: 'Savage Media Team',
        from_name: data.client_name,
        from_email: bookingData.personalDetails.email,
        subject: 'New Booking Request - ' + data.package_name,
    };

    console.log('📧 FINAL templateParams being sent to EmailJS:');
    Object.entries(templateParams).forEach(([key, value]) => {
        console.log(`   ${key}: "${value}"`);
    });

    console.log('📧 Calling emailjs.send() with:');
    console.log('   Service ID:', EMAILJS_SERVICE_ID);
    console.log('   Template ID:', EMAILJS_PROVIDER_TEMPLATE_ID);
    console.log('   Public Key:', EMAILJS_PUBLIC_KEY);

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_PROVIDER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('✅ Provider email SENT successfully');
        console.log('✅ Result:', result);
        console.log('✅ Result.text:', result.text);
        console.log('✅ Result.status:', result.status);
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
    console.log('🚀🚀🚀 sendBookingEmails() CALLED 🚀🚀🚀');
    console.log('🚀 bookingData keys:', Object.keys(bookingData));

    const results = await Promise.allSettled([
        sendCustomerEmail(bookingData),
        sendProviderEmail(bookingData),
    ]);

    console.log('📊 Both email results:');
    console.log('   Customer:', results[0].status, results[0].status === 'rejected' ? results[0].reason : '');
    console.log('   Provider:', results[1].status, results[1].status === 'rejected' ? results[1].reason : '');

    const output = {
        customerSent: results[0].status === 'fulfilled',
        providerSent: results[1].status === 'fulfilled',
        errors: results
            .filter(r => r.status === 'rejected')
            .map(r => r.reason),
    };

    console.log('📊 Final output:', output);

    return output;
}
