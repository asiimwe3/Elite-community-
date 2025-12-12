import { GoogleGenAI, Type, Chat } from "@google/genai";
import { GeneratedAdContent, CampaignType, ScannedWebsiteData, Campaign } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAdCreative = async (
  productName: string,
  productDescription: string,
  targetAudience: string,
  campaignType: CampaignType,
  negativeKeywords?: string
): Promise<GeneratedAdContent> => {
  
  const prompt = `
    You are a world-class digital marketing expert. Create high-converting ad copy and strategy for a ${campaignType} campaign.
    
    Product Name: ${productName}
    Product Description: ${productDescription}
    Target Audience: ${targetAudience}
    ${negativeKeywords ? `Negative Keywords (STRICTLY AVOID these words/concepts in headlines, descriptions, and keywords): ${negativeKeywords}` : ''}

    Please provide:
    1. 5 catchy headlines (max 30 chars each).
    2. 3 persuasive descriptions (max 90 chars each).
    3. 10 relevant SEO/targeting keywords.
    4. A brief strategic advice paragraph (max 50 words) on how to succeed with this campaign.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            descriptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            strategyAdvice: {
              type: Type.STRING
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedAdContent;
    }
    
    throw new Error("No content generated");

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback mock data in case of API failure or rate limits during demo
    return {
      headlines: ["Buy Now & Save", "Best Solution for You", "Top Rated Service", "Don't Miss Out", "Join Today"],
      descriptions: ["Experience the best quality today.", "Limited time offer, sign up now.", "Join thousands of happy customers."],
      keywords: ["marketing", "sales", "growth"],
      strategyAdvice: "Focus on high-intent keywords and retargeting users who visited your site."
    };
  }
};

export const scanWebsiteContent = async (url: string): Promise<ScannedWebsiteData> => {
  const prompt = `
    Analyze the website content for: ${url}
    
    Extract the following details:
    1. Product Name (or Brand Name)
    2. Product Description (Marketing focused, max 200 chars)
    3. Target Audience (Demographics/Interests)

    Return ONLY a raw JSON object with keys: "productName", "productDescription", "targetAudience".
    Do not use markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        // Do not set responseMimeType or responseSchema when using tools
      }
    });
    
    // Cleanup markdown if present
    let cleanText = response.text || "";
    cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let data;
    try {
        data = JSON.parse(cleanText);
    } catch (e) {
        // Fallback if JSON parsing fails, attempt to reconstruct or use raw text
        console.warn("JSON Parse failed, returning raw text as description", e);
        data = {
            productName: "Detected from " + url,
            productDescription: cleanText.substring(0, 150) + "...",
            targetAudience: "General Audience"
        };
    }

    // Extract sources from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((c: any) => c.web?.uri)
      .filter((uri: string) => uri);
      
    return { ...data, sources };

  } catch (error) {
      console.error("Website Scan Error", error);
      throw new Error("Failed to analyze website.");
  }
};

export const analyzeCompetitors = async (url: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview", // Using Pro for deeper reasoning
        contents: `Analyze the potential marketing strategy for a competitor with this website domain: ${url}. 
        Provide 3 key strengths and 3 opportunities for us to outrank them. Keep it concise and use markdown formatting.`,
        config: {
            thinkingConfig: { thinkingBudget: 1024 } 
        }
    });
    return response.text || "Could not analyze competitor.";
  } catch (error) {
    console.error("Gemini Competitor Analysis Error:", error);
    return "Unable to perform analysis at this time.";
  }
}

export const createMarketingChat = (campaigns: Campaign[]): Chat => {
  const context = JSON.stringify(campaigns.map(c => ({
    name: c.name,
    type: c.type,
    status: c.status,
    performance: {
      budget: c.budget,
      spent: c.spent,
      impressions: c.impressions,
      clicks: c.clicks,
      conversions: c.conversions
    }
  })));

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are AdSphere's Lead AI Marketing Analyst. 
      You have access to the user's current campaign data: ${context}.
      
      Your goal is to:
      1. Analyze campaign performance (CTR, CPA, ROAS).
      2. Suggest budget optimizations.
      3. Propose new campaign ideas based on trends.
      4. Debug underperforming campaigns.
      
      Keep answers professional, concise, and actionable. Use markdown for formatting.`
    }
  });
};

export const generateAdImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      }
    });
    
    // Iterate to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const generateVideoScript = async (topic: string, duration: string): Promise<string> => {
  const prompt = `Write a compelling video ad script for: ${topic}. 
  Duration: ${duration}.
  Format: Table with Scene, Visual, and Audio columns.
  Tone: Engaging, Professional.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    return response.text || "Failed to generate script.";
  } catch (error) {
    return "Error generating script.";
  }
};

export const generateVideoAd = async (topic: string, duration: string): Promise<string> => {
  // Create a new instance to ensure fresh API key usage if it was just selected
  const aiVideo = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let operation = await aiVideo.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic video ad about ${topic}. Duration target: ${duration}. High quality, professional lighting.`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await aiVideo.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI in response");
    
    // Append API key for download
    return `${videoUri}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw new Error("Failed to generate video.");
  }
};