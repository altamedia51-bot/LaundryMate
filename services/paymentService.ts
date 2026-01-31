
import { Order } from '../types';

/**
 * Simulasi pemanggilan API Backend ke Payment Gateway (Midtrans/Xendit)
 */
export const createPaymentTransaction = async (order: Order): Promise<string> => {
  // Simulasi network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Dalam real-world, ini akan mengembalikan Snap URL atau QRIS String dari API Midtrans/Xendit
  // Kita gunakan placeholder QR Code generator untuk demo
  const qrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=LAUNDRYMATE-${order.id}-${order.totalPrice}`;
  
  return qrisUrl;
};

/**
 * Simulasi Webhook / Callback dari Payment Gateway
 */
export const simulatePaymentWebhook = (onSuccess: () => void) => {
  // Simulasi user melakukan scan dan membayar setelah 3 detik
  setTimeout(() => {
    onSuccess();
  }, 3000);
};
