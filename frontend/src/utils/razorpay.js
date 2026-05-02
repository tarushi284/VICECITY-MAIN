import api from '../api/axios';

/**
 * Load Razorpay script dynamically
 * @returns {Promise<boolean>} - Returns true if script loaded successfully
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * Initiate Razorpay payment
 * @param {Object} orderData - Order data from backend
 * @param {Object} user - Current user data
 * @param {Function} onSuccess - Success callback
 * @param {Function} onFailure - Failure callback
 */
export const initiatePayment = async (orderData, user, onSuccess, onFailure) => {
    try {
        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
            throw new Error('Failed to load Razorpay SDK');
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id_here',
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'Smart City Portal',
            description: `Ticket for ${orderData.eventTitle}`,
            order_id: orderData.orderId,
            handler: async function (response) {
                try {
                    // Verify payment on backend
                    const verificationResult = await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        eventId: orderData.eventId,
                    });

                    if (onSuccess) {
                        onSuccess(verificationResult);
                    }
                } catch (error) {
                    console.error('Payment verification failed:', error);
                    if (onFailure) {
                        onFailure(error);
                    }
                }
            },
            prefill: {
                name: user?.name || '',
                email: user?.email || '',
            },
            theme: {
                color: '#06b6d4', // Cyan color matching your app theme
            },
            modal: {
                ondismiss: function () {
                    if (onFailure) {
                        onFailure(new Error('Payment cancelled by user'));
                    }
                }
            }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
    } catch (error) {
        console.error('Error initiating payment:', error);
        if (onFailure) {
            onFailure(error);
        }
    }
};

/**
 * Verify payment with backend
 * @param {Object} paymentData - Payment data from Razorpay
 * @returns {Promise<Object>} - Verification result
 */
export const verifyPayment = async (paymentData) => {
    try {
        const { data } = await api.post('/payments/verify', paymentData);
        return data;
    } catch (error) {
        console.error('Payment verification error:', error);
        throw error;
    }
};

/**
 * Create payment order
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Order data
 */
export const createPaymentOrder = async (eventId) => {
    try {
        const { data } = await api.post('/payments/create-order', { eventId });
        return data;
    } catch (error) {
        console.error('Error creating payment order:', error);
        throw error;
    }
};
