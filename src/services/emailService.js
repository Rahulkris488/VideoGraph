import emailjs from '@emailjs/browser';

// ============================================
// EmailJS Configuration
// ============================================
const EMAILJS_SERVICE_ID = 'service_dzob1f2';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_0lroqnz';
const EMAILJS_PROVIDER_TEMPLATE_ID = 'template_qanp6c8';
const EMAILJS_PUBLIC_KEY = 'bS0r5VmlPI7Ottbfg';
const PROVIDER_EMAIL = 'rahulkrishnatp12@gmail.com';

/**
 * Build the complete styled HTML email with all data already injected.
 * This is sent as a single "message" param. The EmailJS template
 * should contain ONLY:  {{{message}}}   (triple curly braces)
 */
function buildEmailHTML(bookingData) {
    const { selectedPack, selectedDate, selectedTime, personalDetails, propertyDetails } = bookingData;

    const dateStr = selectedDate
        ? new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
        : 'Not selected';

    const includesList = selectedPack?.includes
        ? (Array.isArray(selectedPack.includes) ? selectedPack.includes.join(', ') : selectedPack.includes)
        : 'N/A';

    const phone = [personalDetails?.countryCode, personalDetails?.phone].filter(Boolean).join(' ') || 'N/A';
    const clientName = [personalDetails?.firstName, personalDetails?.lastName].filter(Boolean).join(' ') || 'N/A';
    const packageName = selectedPack?.name || 'N/A';
    const duration = selectedPack?.duration || 'N/A';
    const description = selectedPack?.description || 'N/A';
    const clientEmail = personalDetails?.email || 'N/A';
    const sqft = propertyDetails?.sqft || 'N/A';
    const brokerage = propertyDetails?.brokerage || 'N/A';
    const lockbox = propertyDetails?.lockbox || 'N/A';
    const listingDate = propertyDetails?.listingDate || 'N/A';
    const address = propertyDetails?.address || 'N/A';

    // The entire email is a single HTML string with real data injected via ${}.
    // No {{placeholders}} — everything is already resolved.
    return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8e4df;font-family:Georgia,'Times New Roman',Times,serif;">
<tr>
<td align="center" style="padding:40px 15px;">

<table width="750" cellpadding="0" cellspacing="0" border="0" style="max-width:750px;width:100%;background-color:#ffffff;border-radius:4px;overflow:hidden;">

  <tr>
    <td style="height:5px;background-color:#b08d3e;"></td>
  </tr>

  <tr>
    <td style="padding:50px 60px 30px 60px;border-bottom:2px solid #1a1a1a;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#1a1a1a;letter-spacing:3px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">SAVAGE</h1>
            <p style="margin:4px 0 0 0;font-size:10px;letter-spacing:5px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Digital Media Services</p>
          </td>
          <td align="right" valign="top">
            <p style="margin:0;font-size:11px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Confirmation</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:40px 60px 10px 60px;">
      <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:5px;color:#b08d3e;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;font-weight:700;">Booking Confirmation</p>
      <h2 style="margin:0 0 24px 0;font-size:28px;color:#1a1a1a;font-weight:400;line-height:1.3;">Your Session is Booked</h2>
      <p style="margin:0 0 8px 0;font-size:15px;color:#444444;line-height:1.8;">Dear <strong style="color:#1a1a1a;">${clientName}</strong>,</p>
      <p style="margin:0;font-size:15px;color:#444444;line-height:1.8;">Thank you for booking with Savage Digital Media. We are pleased to confirm the following details for your upcoming session.</p>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 60px 0 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #e0e0e0;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 60px 10px 60px;">
      <p style="margin:0;font-size:11px;letter-spacing:5px;color:#b08d3e;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;font-weight:700;">Service Details</p>
    </td>
  </tr>
  <tr>
    <td style="padding:10px 60px 0 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;">
        <tr>
          <td colspan="2" style="padding:22px 28px;background-color:#fafaf8;border-bottom:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Package</p>
            <p style="margin:0;font-size:20px;color:#1a1a1a;font-weight:700;font-family:Helvetica,Arial,sans-serif;">${packageName}</p>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:18px 28px;border-bottom:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Description</p>
            <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">${description}</p>
          </td>
        </tr>
        <tr>
          <td width="40%" style="padding:18px 28px;border-right:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Duration</p>
            <p style="margin:0;font-size:16px;color:#1a1a1a;font-weight:600;">${duration}</p>
          </td>
          <td width="60%" style="padding:18px 28px;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Includes</p>
            <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">${includesList}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 60px 10px 60px;">
      <p style="margin:0;font-size:11px;letter-spacing:5px;color:#b08d3e;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;font-weight:700;">Appointment</p>
    </td>
  </tr>
  <tr>
    <td style="padding:10px 60px 0 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;">
        <tr>
          <td width="60%" style="padding:22px 28px;border-right:1px solid #e8e8e8;background-color:#fafaf8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Date</p>
            <p style="margin:0;font-size:17px;color:#1a1a1a;font-weight:600;">${dateStr}</p>
          </td>
          <td width="40%" style="padding:22px 28px;background-color:#fafaf8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Time</p>
            <p style="margin:0;font-size:17px;color:#1a1a1a;font-weight:600;">${selectedTime || 'N/A'}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 60px 10px 60px;">
      <p style="margin:0;font-size:11px;letter-spacing:5px;color:#b08d3e;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;font-weight:700;">Client Information</p>
    </td>
  </tr>
  <tr>
    <td style="padding:10px 60px 0 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;">
        <tr>
          <td colspan="2" style="padding:20px 28px;border-bottom:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Full Name</p>
            <p style="margin:0;font-size:18px;color:#1a1a1a;font-weight:600;">${clientName}</p>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding:20px 28px;border-right:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Phone</p>
            <p style="margin:0;font-size:15px;color:#333333;">${phone}</p>
          </td>
          <td width="50%" style="padding:20px 28px;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Email</p>
            <p style="margin:0;font-size:15px;color:#333333;">${clientEmail}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 60px 10px 60px;">
      <p style="margin:0;font-size:11px;letter-spacing:5px;color:#b08d3e;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;font-weight:700;">Property Details</p>
    </td>
  </tr>
  <tr>
    <td style="padding:10px 60px 0 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;">
        <tr>
          <td colspan="2" style="padding:20px 28px;border-bottom:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Property Address</p>
            <p style="margin:0;font-size:16px;color:#1a1a1a;font-weight:600;">${address}</p>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding:20px 28px;border-right:1px solid #e8e8e8;border-bottom:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Approx. Sq. Ft.</p>
            <p style="margin:0;font-size:17px;color:#1a1a1a;font-weight:600;">${sqft}</p>
          </td>
          <td width="50%" style="padding:20px 28px;border-bottom:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Brokerage</p>
            <p style="margin:0;font-size:17px;color:#1a1a1a;font-weight:600;">${brokerage}</p>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding:20px 28px;border-right:1px solid #e8e8e8;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Lockbox</p>
            <p style="margin:0;font-size:17px;color:#1a1a1a;font-weight:600;">${lockbox}</p>
          </td>
          <td width="50%" style="padding:20px 28px;">
            <p style="margin:0 0 3px 0;font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Expected Listing Date</p>
            <p style="margin:0;font-size:17px;color:#1a1a1a;font-weight:600;">${listingDate}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:35px 60px 0 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #e0e0e0;font-size:1px;line-height:1px;">&nbsp;</td></tr></table>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 60px 10px 60px;">
      <p style="margin:0 0 10px 0;font-size:15px;color:#444444;line-height:1.8;">Should you need to make any changes or have any questions, please reply to this email.</p>
      <p style="margin:0 0 25px 0;font-size:15px;color:#444444;line-height:1.8;">We look forward to delivering an exceptional experience.</p>
      <p style="margin:0 0 3px 0;font-size:15px;color:#1a1a1a;font-style:italic;">Warm regards,</p>
      <p style="margin:0;font-size:16px;color:#1a1a1a;font-weight:700;font-family:Helvetica,Arial,sans-serif;">The Savage Media Team</p>
    </td>
  </tr>

  <tr>
    <td style="padding:30px 60px 35px 60px;background-color:#fafaf8;border-top:1px solid #e8e8e8;text-align:center;">
      <p style="margin:0 0 5px 0;font-size:11px;color:#999999;letter-spacing:2px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Savage Digital Media</p>
      <p style="margin:0;font-size:11px;color:#bbbbbb;font-family:Helvetica,Arial,sans-serif;">Professional Media Services</p>
    </td>
  </tr>

  <tr>
    <td style="height:5px;background-color:#b08d3e;"></td>
  </tr>

</table>

</td>
</tr>
</table>
`.trim();
}

/**
 * Send confirmation email to the customer
 */
export async function sendCustomerEmail(bookingData) {
    const message = buildEmailHTML(bookingData);
    const clientName = [bookingData.personalDetails?.firstName, bookingData.personalDetails?.lastName].filter(Boolean).join(' ');

    const templateParams = {
        to_email: bookingData.personalDetails.email,
        to_name: clientName,
        subject: 'Booking Confirmation - ' + (bookingData.selectedPack?.name || ''),
        message: message,
    };

    console.log('📧 SENDING CUSTOMER EMAIL');
    console.log('📧 to_email:', templateParams.to_email);
    console.log('📧 to_name:', templateParams.to_name);
    console.log('📧 message length:', message.length);
    console.log('📧 message preview:', message.substring(0, 200));

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_CUSTOMER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('✅ Customer email sent:', result.text);
        return result;
    } catch (error) {
        console.error('❌ Failed to send customer email:', error);
        throw error;
    }
}

/**
 * Send notification email to the service provider
 */
export async function sendProviderEmail(bookingData) {
    const message = buildEmailHTML(bookingData);
    const clientName = [bookingData.personalDetails?.firstName, bookingData.personalDetails?.lastName].filter(Boolean).join(' ');

    const templateParams = {
        to_email: PROVIDER_EMAIL,
        to_name: 'Savage Media Team',
        from_name: clientName,
        from_email: bookingData.personalDetails.email,
        subject: 'New Booking Request - ' + (bookingData.selectedPack?.name || ''),
        message: message,
    };

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_PROVIDER_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        console.log('✅ Provider email sent:', result.text);
        return result;
    } catch (error) {
        console.error('❌ Failed to send provider email:', error);
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

    return {
        customerSent: results[0].status === 'fulfilled',
        providerSent: results[1].status === 'fulfilled',
        errors: results
            .filter(r => r.status === 'rejected')
            .map(r => r.reason),
    };
}
