/**
 * WhatsApp Integration Utilities
 * Helper to generate pre-filled click-to-chat WhatsApp links.
 */

export function cleanPhone(phone: string): string {
  // Remove all non-numeric characters except optionally leading '+'
  let cleaned = phone.replace(/[^\d+]/g, "");

  // If it starts with '+', remove it
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // If it is 10 digits (e.g. standard Indian mobile), prepend country code '91'
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }

  return cleaned;
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const number = cleanPhone(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const whatsappTemplates = {
  quotation: (customerName: string, packageName: string, price: string, url: string) =>
    `Hello ${customerName},\n\nWe are excited to share the customized travel itinerary for your upcoming *${packageName}* trip.\n\n💰 Package Price: ${price}\n📄 View Detailed Itinerary & Quote here: ${url}\n\nPlease let us know if you would like any modifications.\n\nWarm regards,\nLook My Holidays`,

  invoice: (customerName: string, invoiceId: string, amount: string, url: string) =>
    `Dear ${customerName},\n\nHere is the invoice *${invoiceId}* for your travel booking.\n\n💵 Total Amount: ${amount}\n📄 View & Download Invoice: ${url}\n\nPlease let us know once the payment is initiated.\n\nThank you,\nLook My Holidays`,

  voucher: (customerName: string, packageName: string, bookingRef: string, url: string) =>
    `Hello ${customerName},\n\nYour travel vouchers for *${packageName}* (Booking Ref: *${bookingRef}*) are now ready!\n\n🎒 Download Vouchers: ${url}\n\nHave a safe and wonderful trip!\n\nBest,\nLook My Holidays`,

  paymentReminder: (
    customerName: string,
    packageName: string,
    pendingAmount: string,
    dueDate: string,
  ) =>
    `Dear ${customerName},\n\nThis is a friendly reminder regarding the pending balance of *${pendingAmount}* for your *${packageName}* booking.\n\n📅 Due Date: ${dueDate}\n\nYou can view your booking details and make payments in your customer portal.\n\nThank you for choosing Look My Holidays.`,

  feedback: (customerName: string, packageName: string) =>
    `Hello ${customerName},\n\nWelcome back! We hope you had a fantastic experience on your trip to *${packageName}*.\n\nWe would love to hear your feedback. Please take a moment to rate us: https://g.page/lookmyholidays/review\n\nThank you,\nLook My Holidays`,
};
