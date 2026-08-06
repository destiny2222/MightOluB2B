export interface BotResponse {
  message: string;
  isError?: boolean;
  suggestedPrompts?: string[];
  metadata?: any;
}

export interface ChatState {
  currentFlow?: 'bulk_quote' | null;
  step?: number;
  data?: {
    product?: string;
    quantity?: string;
    frequency?: string;
  };
}

// Fallback B2B/FAQ keywords generator for quick prompts
function getContextualPrompts(message: string, accountType: 'guest' | 'b2c' | 'b2b'): string[] {
  const normalized = message.toLowerCase();
  if (accountType === 'b2b') {
    if (normalized.includes('quote') || normalized.includes('price')) {
      return ['Request a bulk quote', 'Speak to my account manager', 'Main Menu'];
    }
    if (normalized.includes('balance') || normalized.includes('credit') || normalized.includes('limit')) {
      return ['Check my account balance', 'Speak to my account manager', 'Main Menu'];
    }
    if (normalized.includes('reorder') || normalized.includes('order')) {
      return ['Reorder my last bulk order', 'Speak to my account manager', 'Main Menu'];
    }
    return ['Request a bulk quote', 'Check my account balance', 'Reorder my last bulk order', 'Speak to my account manager'];
  } else {
    return ['How to apply for Trade Account', 'Delivery & Shipping', 'Payment terms', 'Contact info'];
  }
}

// Rich B2B Mock logic (used as fallback if Gemini is offline/unconfigured)
async function getMockResponse(
  message: string,
  accountType: 'guest' | 'b2c' | 'b2b',
  userContext: any,
  state: ChatState = {}
): Promise<{ response: BotResponse; newState: ChatState }> {
  const normalizedMsg = message.toLowerCase().trim();

  // Handle multi-turn Bulk Quote Flow
  if (state.currentFlow === 'bulk_quote') {
    const step = state.step || 1;
    const data = { ...state.data };

    if (step === 1) {
      data.product = message;
      return {
        response: {
          message: `Great. What quantity of "${message}" are you looking to order? (e.g. "500 units", "2 pallets")`,
        },
        newState: { currentFlow: 'bulk_quote', step: 2, data },
      };
    } else if (step === 2) {
      data.quantity = message;
      return {
        response: {
          message: `Got it: ${data.quantity} of "${data.product}". How frequently do you expect to order this? (e.g. "One-off", "Weekly", "Monthly")`,
        },
        newState: { currentFlow: 'bulk_quote', step: 3, data },
      };
    } else if (step === 3) {
      data.frequency = message;
      return {
        response: {
          message: `Thank you! I have structured your wholesale quote request:\n\n` +
            `• **Product:** ${data.product}\n` +
            `• **Quantity:** ${data.quantity}\n` +
            `• **Frequency:** ${data.frequency}\n\n` +
            `This has been submitted to our Trade Sales Team (trade@mightyolu.com). An account manager will review this and email you within 2 business hours.`,
          suggestedPrompts: ['Check my account balance', 'Speak to my account manager', 'Main Menu']
        },
        newState: { currentFlow: null, step: 0, data: {} },
      };
    }
  }

  // Handle non-B2B gates
  if (accountType !== 'b2b') {
    if (
      normalizedMsg.includes('quote') ||
      normalizedMsg.includes('balance') ||
      normalizedMsg.includes('reorder') ||
      normalizedMsg.includes('manager')
    ) {
      return {
        response: {
          message: `Trade features like bulk quotes, account balance, and recurring orders are exclusive to registered B2B Trade Account holders.\n\n` +
            `Please sign in with your Trade Account, or register for a B2B account on our site to unlock these tools.`,
          suggestedPrompts: ['How to apply for Trade Account', 'Contact sales info']
        },
        newState: {}
      };
    }
  }

  if (normalizedMsg.includes('bulk quote') || normalizedMsg === 'request a bulk quote') {
    return {
      response: {
        message: 'I can help you submit a wholesale quote request to our sales team. First, what product are you interested in?',
      },
      newState: { currentFlow: 'bulk_quote', step: 1, data: {} }
    };
  }

  if (normalizedMsg.includes('account balance') || normalizedMsg === 'check my account balance') {
    const userName = userContext?.name || 'Trade Partner';
    const company = userContext?.company_name || 'your business';
    return {
      response: {
        message: `Hello ${userName}, here is the current statement for **${company}**:\n\n` +
          `• **Credit Limit:** £10,000.00\n` +
          `• **Available Credit:** £7,450.00\n` +
          `• **Outstanding Balance:** £2,550.00 (Due: 30 days terms)\n\n` +
          `If you need to make a payment or request a credit limit increase, please contact accounts@mightyolu.com.`,
        suggestedPrompts: ['Request a bulk quote', 'Speak to my account manager']
      },
      newState: {}
    };
  }

  if (normalizedMsg.includes('reorder') || normalizedMsg === 'reorder my last bulk order') {
    return {
      response: {
        message: `I found your last bulk order placed on August 1st, 2026:\n\n` +
          `• **Order ID:** #MO-B2B-98442\n` +
          `• **Items:** Banga Red Palm Oil (500 units), Fresh Yam (100 boxes)\n` +
          `• **Total:** £3,120.00\n\n` +
          `Would you like me to generate a new checkout draft for this order, or contact your account manager to schedule it?`,
        suggestedPrompts: ['Generate reorder draft', 'Speak to my account manager', 'Main Menu']
      },
      newState: {}
    };
  }

  if (normalizedMsg.includes('generate reorder draft')) {
    return {
      response: {
        message: `I have generated a new draft order **#MO-B2B-DRAFT-092** in your Trade Account portal.\n\n` +
          `You can view, edit, and complete this purchase under **"Recurring Drafts"** in your account menu, or click here to go to the checkout.`,
        suggestedPrompts: ['Check my account balance', 'Main Menu']
      },
      newState: {}
    };
  }

  if (normalizedMsg.includes('account manager') || normalizedMsg === 'speak to my account manager') {
    return {
      response: {
        message: `Your dedicated Trade Account Manager is **Sarah Jenkins**.\n\n` +
          `• **Direct Line:** 07867986338\n` +
          `• **Email:** sarah.j@mightyolu.com\n` +
          `• **Working Hours:** Mon - Fri, 8:00 AM - 5:00 PM GMT\n\n` +
          `You can reach out to her directly for contract pricing, special shipping arrangements, or bulk container orders.`,
        suggestedPrompts: ['Request a bulk quote', 'Check my account balance']
      },
      newState: {}
    };
  }

  if (normalizedMsg.includes('how to apply') || normalizedMsg.includes('trade account') || normalizedMsg.includes('register')) {
    return {
      response: {
        message: `To apply for a Mightyolu B2B Trade Account:\n\n` +
          `1. Go to the registration page and choose **Trade Account**.\n` +
          `2. Fill in your business details and VAT/Company registration number.\n` +
          `3. Submit your application. Our team will review and approve it within 24 hours.\n\n` +
          `Approved accounts gain access to wholesale pricing, credit payment terms, and direct account manager support.`,
          suggestedPrompts: ['Contact sales info', 'Main Menu']
      },
      newState: {}
    };
  }

  if (normalizedMsg.includes('delivery') || normalizedMsg.includes('shipping')) {
    return {
      response: {
        message: `**Mightyolu Delivery Information:**\n\n` +
          `• **B2C Standard:** Delivery nationwide in the UK within 2-3 business days. Free for orders over £50.\n` +
          `• **B2B Bulk Delivery:** Pallet shipping via commercial carriers is available. Delivery times vary between 1-3 business days.\n` +
          `• **Minimum Order Quantity (MOQ) for B2B Pallet:** £500.`,
        suggestedPrompts: ['Speak to my account manager', 'Main Menu']
      },
      newState: {}
    };
  }

  if (normalizedMsg.includes('payment') || normalizedMsg.includes('invoice')) {
    return {
      response: {
        message: `We accept the following payment methods:\n\n` +
          `• **Credit/Debit Cards:** Visa, Mastercard, American Express\n` +
          `• **B2B Invoice Payment:** Available for approved Trade customers on Net 30/Net 60 terms via bank transfer (BACS).\n` +
          `• **Apple Pay / Google Pay** on standard checkout.`,
        suggestedPrompts: ['Check my account balance', 'Main Menu']
      },
      newState: {}
    };
  }

  if (normalizedMsg.includes('purchase') || normalizedMsg.includes('buy') || normalizedMsg.includes('how to order')) {
    if (accountType === 'b2b') {
      return {
        response: {
          message: `To purchase products under your **Mightyolu B2B Trade Account**:\n\n` +
            `1. Ensure you are switched to the **Business view** using the top-bar account toggle.\n` +
            `2. Add bulk items to your cart. Pallet shipping has a minimum order value (MOQ) of £500.\n` +
            `3. Complete checkout using your approved **Trade Credit Line** (Net 30/Net 60 terms) or standard bank transfer.\n` +
            `4. You can also replicate past B2B orders or schedule recurring drop-offs under **"Recurring Drafts"** in the Trade portal.`,
          suggestedPrompts: ['Reorder my last bulk order', 'Request a bulk quote', 'Speak to my account manager']
        },
        newState: {}
      };
    } else {
      return {
        response: {
          message: `To purchase products on Mightyolu.com as a standard retail shopper:\n\n` +
            `1. Browse our categories or search for the grocery items you need.\n` +
            `2. Add the items to your shopping cart.\n` +
            `3. Open your cart and proceed to checkout to pay securely via credit card, debit card, Apple Pay, or Google Pay.\n\n` +
            `*Note: If you run a business, apply for a Trade Account to access credit terms and bulk discount rates.*`,
          suggestedPrompts: ['How to apply for Trade Account', 'Delivery & Shipping', 'Main Menu']
        },
        newState: {}
      };
    }
  }

  if (normalizedMsg.includes('contact') || normalizedMsg.includes('sales info') || normalizedMsg.includes('email')) {
    return {
      response: {
        message: `You can reach Mightyolu support and sales at:\n\n` +
          `• **General Email:** inquiry@mightyolu.com\n` +
          `• **Trade/Sales Email:** trade@mightyolu.com\n` +
          `• **Phone Support:** 07867986338 (Mon-Fri 9:00 - 17:00)\n` +
          `• **Warehouse Address:** Unit 4, Gateway Trade Park, Manchester`,
        suggestedPrompts: ['Main Menu']
      },
      newState: {}
    };
  }

  return {
    response: {
      message: `Welcome to the Mightyolu Assistant! I can help you with wholesale inquiries, delivery tracking, account status, and general FAQs.`,
      suggestedPrompts: accountType === 'b2b'
        ? ['Request a bulk quote', 'Check my account balance', 'Speak to my account manager', 'Main Menu']
        : ['How to apply for Trade Account', 'Contact info', 'Main Menu']
    },
    newState: {}
  };
}

export async function sendChatbotMessage(
  message: string,
  messagesHistory: any[],
  accountType: 'guest' | 'b2c' | 'b2b',
  userContext: any,
  state: ChatState = {}
): Promise<{ response: BotResponse; newState: ChatState }> {
  // If the user triggers specific multi-turn quote flows, process locally with state tracking
  if (state.currentFlow === 'bulk_quote' || message.toLowerCase().trim() === 'request a bulk quote' || message.toLowerCase().trim() === 'bulk quote') {
    return getMockResponse(message, accountType, userContext, state);
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messagesHistory,
        accountType,
        userContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API Route returned error: ${response.status}`);
    }

    const data = await response.json();
    return {
      response: {
        message: data.message,
        suggestedPrompts: getContextualPrompts(data.message, accountType)
      },
      newState: {}
    };
  } catch (error) {
    console.warn("Gemini API call failed, falling back to mock B2B responses:", error);
    // Graceful fallback to B2B mock response logic
    return getMockResponse(message, accountType, userContext, state);
  }
}
