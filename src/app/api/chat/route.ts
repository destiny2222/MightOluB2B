import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, accountType, userContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Fetch live product catalog context
    let catalogContext = "";
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const catalogRes = await fetch(`${baseUrl}/api/v1/b2b/catalog?page=1`, {
        headers: {
          "Accept": "application/json"
        }
      });
      if (catalogRes.ok) {
        const catalogData = await catalogRes.json();
        if (catalogData && catalogData.data && catalogData.data.length > 0) {
          catalogContext = "\n\nAVAILABLE PRODUCT CATALOG:\n" + catalogData.data.map((item: any) => 
            `- **${item.title}**:\n` +
            `  * Standard Price: £${item.standard_price} (Trade B2B Price: £${item.trade_price})\n` +
            `  * Availability: ${item.availability}\n` +
            `  * Minimum Order Quantity (MOQ): ${item.minimum_order_quantity} units\n` +
            `  * Link Slug: ${item.slug}\n` +
            `  * Description: ${item.description}`
          ).join("\n");
        }
      }
    } catch (err) {
      console.warn("Failed to fetch product catalog context dynamically:", err);
    }

    // Define B2B & B2C System Instructions
    const systemPrompt = `You are the Mightyolu AI Assistant, a helpful and professional customer service agent for Mightyolu.com, a leading food/grocery storefront and B2B Trade Portal based in Manchester, UK.

Current User Account Type: ${accountType.toUpperCase()}
${userContext ? `Logged-in User Details: Name: ${userContext.name}, Company: ${userContext.company_name || 'N/A'}` : ''}

Behavioral Guidelines:
1. Greet the user based on their Account Type. B2B Trade customers should be treated as business partners. Guests should be encouraged to apply for a Trade Account if they inquire about bulk pricing or trade benefits.
2. Direct Contact Info:
   - Trade Account Manager: Sarah Jenkins (Direct: 07867986338, Email: sarah.j@mightyolu.com).
   - General Enquiries: inquiry@mightyolu.com or 07867986338.
   - B2B/Trade Sales: trade@mightyolu.com.
3. Common procedures:
   - Wholesale/Bulk Quotes: Mightyolu handles bulk quote requests through the Sales Team. Advise them to provide the product, estimated volume, and delivery frequency.
   - How to Purchase:
     * Guests/B2C: Simply browse the catalog, add products to your cart, and complete checkout using credit card, debit card, Apple Pay, or Google Pay.
     * B2B Trade Partners: Switch to the Business view in the portal. You can add products to your basket and check out using your approved Trade Credit Line (Net 30/60 invoice terms), submit a Request for Quote (RFQ), or set up a recurring schedule via "Recurring Drafts".
   - Account Balance: If B2B, advise they can request detailed statements from accounts@mightyolu.com. Tell them their account credit limit is £10,000.00 with £2,550.00 outstanding (due net 30) for demonstration purposes if they ask.
   - Delivery: B2C standard is free over £50. B2B bulk orders are shipped via pallet with a Minimum Order Quantity (MOQ) of £500.
4. Formatting: Keep responses readable, well-spaced, and use bullet points for lists. Always be polite, professional, and clear.
5. Limits: Never negotiate pricing or promise custom discounts. Direct pricing negotiations to Sarah Jenkins.
6. Product Stock & Catalog Enquiries:
   - When a user asks about product stock, catalog items, pricing, or specifications, consult the catalog list below.
   - If the product exists in the catalog list, confirm it is available and provide its details and price.
   - **Crucial Link Formatting**: Always include a link to the product's details page using standard Markdown format exactly as follows: [Product Title](/shop-details?slug=link-slug) replacing link-slug with the actual Link Slug provided.
   - If the product is not in the catalog below, politely explain that we don't currently have it in stock and offer to contact Sarah Jenkins or take a request.${catalogContext}`;

    // Map message history to Gemini API format (contents array)
    // Map 'bot' role to 'model', and filter messages to match Gemini's strict alternating format
    const contents = messages
      .filter((m: any) => m.id !== "welcome") // Skip initial welcome to avoid formatting issues
      .map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    // If contents array is empty, add a greeting placeholder to kickstart dialogue if needed
    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Hello" }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch response from Gemini API." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json(
        { error: "No response text generated from the model." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: candidateText });
  } catch (error: any) {
    console.error("Server API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
