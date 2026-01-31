
import { GoogleGenAI } from "@google/genai";

// Safety check for process.env
const getApiKey = () => {
  try {
    return typeof process !== 'undefined' ? process.env.API_KEY : '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() || '' });

const CACHE_KEY = 'laundry_tip_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;
const COOLDOWN_KEY = 'gemini_error_cooldown';
const COOLDOWN_DURATION = 60 * 60 * 1000;

const FALLBACK_TIPS = [
  "Pisahkan pakaian putih dan berwarna agar tidak luntur!",
  "Gunakan air dingin untuk menjaga serat kain tetap awet.",
  "Balik pakaian sebelum mencuci untuk melindungi warna bagian luar.",
  "Jangan mengisi mesin cuci terlalu penuh agar pembersihan maksimal.",
  "Gunakan deterjen secukupnya; terlalu banyak busa sulit dibilas.",
  "Segera gantung pakaian setelah dicuci agar tidak bau apek.",
  "Gunakan cuka putih untuk menghilangkan bau keringat yang membandel.",
  "Cuci handuk secara terpisah agar seratnya tetap lembut dan menyerap."
];

export const generateLaundryTip = async () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
  }

  const lastError = localStorage.getItem(COOLDOWN_KEY);
  if (lastError) {
    const timeSinceError = new Date().getTime() - parseInt(lastError);
    if (timeSinceError < COOLDOWN_DURATION) {
      return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
    } else {
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }

  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    try {
      const { tip, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      if (now - timestamp < CACHE_EXPIRY) {
        return tip;
      }
    } catch (e) {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Berikan satu tips singkat tentang perawatan pakaian atau laundry dalam bahasa Indonesia yang menarik untuk pelanggan. Maksimal 12 kata.',
      config: {
        temperature: 0.7,
      }
    });
    
    const tipText = response.text?.trim();
    if (tipText) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        tip: tipText,
        timestamp: new Date().getTime()
      }));
      return tipText;
    }
    return FALLBACK_TIPS[0];
  } catch (error: any) {
    localStorage.setItem(COOLDOWN_KEY, new Date().getTime().toString());
    return FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
  }
};
