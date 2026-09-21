/**
 * data/messages.ts
 * Alert message templates in English, Hindi, and Tamil.
 * Used for voice captions and mock WhatsApp/SMS messages.
 */

export type ScenarioId = "forest_fire" | "landslide" | "flash_flood";
export type Language = "en" | "hi" | "ta";

export interface AlertMessage {
  scenarioId: ScenarioId;
  lang: Language;
  langLabel: string;     // display name
  short: string;         // ~160 chars for SMS
  voice: string;         // slightly longer, spoken aloud
  caption: string;       // shown as live caption during audio
}

export const ALERT_MESSAGES: AlertMessage[] = [
  // ── Forest Fire ──────────────────────────────────────────────────
  {
    scenarioId: "forest_fire",
    lang: "en",
    langLabel: "English",
    short:
      "FIRE ALERT — ResiliNet-AI has confirmed a forest fire near {node}. " +
      "Evacuate to {shelter} immediately. Keep roads clear for responders.",
    voice:
      "Attention. ResiliNet early warning: a forest fire has been confirmed near {node}. " +
      "Please evacuate to {shelter} immediately. Keep all roads clear for emergency responders.",
    caption:
      "⚠ FIRE ALERT — Confirmed near {node}. Evacuate to {shelter} now.",
  },
  {
    scenarioId: "forest_fire",
    lang: "hi",
    langLabel: "हिंदी",
    short:
      "आग की चेतावनी — ResiliNet-AI ने {node} के पास जंगल में आग की पुष्टि की है। " +
      "तुरंत {shelter} की ओर जाएं। सड़कें राहत दल के लिए खाली रखें।",
    voice:
      "ध्यान दें। ResiliNet प्रारंभिक चेतावनी: {node} के पास जंगल में आग की पुष्टि हो गई है। " +
      "कृपया तुरंत {shelter} की ओर जाएं। आपातकालीन दल के लिए सभी सड़कें खाली रखें।",
    caption: "⚠ आग चेतावनी — {node} के पास पुष्टि। अभी {shelter} जाएं।",
  },
  {
    scenarioId: "forest_fire",
    lang: "ta",
    langLabel: "தமிழ்",
    short:
      "தீ எச்சரிக்கை — ResiliNet-AI {node} அருகே காட்டுத் தீயை உறுதிப்படுத்தியது. " +
      "உடனடியாக {shelter} க்கு செல்லுங்கள். வழிகளை காப்பாளர்களுக்காக காலியாக வையுங்கள்.",
    voice:
      "கவனிங்கள். ResiliNet ஆரம்ப எச்சரிக்கை: {node} அருகே காட்டுத் தீ உறுதிப்படுத்தப்பட்டது. " +
      "உடனடியாக {shelter} க்கு செல்லுங்கள். அவசர குழுவிற்காக அனைத்து வழிகளையும் காலியாக வையுங்கள்.",
    caption: "⚠ தீ எச்சரிக்கை — {node} அருகே உறுதி. இப்போது {shelter} செல்லுங்கள்.",
  },

  // ── Landslide ────────────────────────────────────────────────────
  {
    scenarioId: "landslide",
    lang: "en",
    langLabel: "English",
    short:
      "LANDSLIDE ALERT — ResiliNet-AI detects slope instability near {node}. " +
      "Move away from hillsides to {shelter}. Avoid roads below {node}.",
    voice:
      "Attention. ResiliNet early warning: slope instability and possible landslide detected near {node}. " +
      "Move away from hillsides immediately and go to {shelter}. Avoid all roads below {node}.",
    caption: "⚠ LANDSLIDE ALERT — Slope unstable near {node}. Go to {shelter}.",
  },
  {
    scenarioId: "landslide",
    lang: "hi",
    langLabel: "हिंदी",
    short:
      "भूस्खलन चेतावनी — ResiliNet-AI ने {node} के पास ढलान अस्थिरता का पता लगाया है। " +
      "पहाड़ी से दूर {shelter} की ओर जाएं। {node} के नीचे की सड़कों से बचें।",
    voice:
      "ध्यान दें। ResiliNet प्रारंभिक चेतावनी: {node} के पास ढलान अस्थिरता और संभावित भूस्खलन का पता चला है। " +
      "तुरंत पहाड़ी से दूर जाएं और {shelter} की ओर जाएं।",
    caption: "⚠ भूस्खलन चेतावनी — {node} के पास ढलान अस्थिर। {shelter} जाएं।",
  },
  {
    scenarioId: "landslide",
    lang: "ta",
    langLabel: "தமிழ்",
    short:
      "நிலச்சரிவு எச்சரிக்கை — ResiliNet-AI {node} அருகே சரிவு நிலையற்றதை கண்டறிந்தது. " +
      "மலைப்பகுதியிலிருந்து விலகி {shelter} க்கு செல்லுங்கள்.",
    voice:
      "கவனிங்கள். ResiliNet ஆரம்ப எச்சரிக்கை: {node} அருகே சரிவு நிலையற்ற நிலையும் நிலச்சரிவும் கண்டறியப்பட்டது. " +
      "உடனடியாக மலைப்பகுதியிலிருந்து விலகி {shelter} க்கு செல்லுங்கள்.",
    caption: "⚠ நிலச்சரிவு எச்சரிக்கை — {node} அருகே சரிவு நிலையற்றது. {shelter} செல்லுங்கள்.",
  },

  // ── Flash Flood ──────────────────────────────────────────────────
  {
    scenarioId: "flash_flood",
    lang: "en",
    langLabel: "English",
    short:
      "FLOOD ALERT — {node} reports water level rising +{rise} cm/min. " +
      "Evacuate low-lying areas near {village} to {shelter} immediately.",
    voice:
      "Attention. ResiliNet early warning: flash flood risk. Water level rising at plus {rise} centimetres per minute at {node}. " +
      "Evacuate low-lying areas near {village} to {shelter} immediately. Do not attempt to cross flooded roads.",
    caption:
      "⚠ FLOOD ALERT — Water +{rise} cm/min at {node}. Evacuate {village} to {shelter}.",
  },
  {
    scenarioId: "flash_flood",
    lang: "hi",
    langLabel: "हिंदी",
    short:
      "बाढ़ चेतावनी — {node} पर जल स्तर +{rise} सेमी/मिनट की दर से बढ़ रहा है। " +
      "{village} के निचले इलाकों से {shelter} की ओर तुरंत जाएं।",
    voice:
      "ध्यान दें। ResiliNet प्रारंभिक चेतावनी: अचानक बाढ़ का खतरा। {node} पर जल स्तर प्रति मिनट {rise} सेंटीमीटर की दर से बढ़ रहा है। " +
      "{village} के निचले इलाकों से {shelter} की ओर तुरंत जाएं।",
    caption: "⚠ बाढ़ चेतावनी — {node} पर +{rise} सेमी/मिनट। {village} खाली करें।",
  },
  {
    scenarioId: "flash_flood",
    lang: "ta",
    langLabel: "தமிழ்",
    short:
      "வெள்ள எச்சரிக்கை — {node} இல் நீர்மட்டம் +{rise} செமீ/நிமிடம் உயர்கிறது. " +
      "{village} அருகே தாழ்வான பகுதிகளிலிருந்து {shelter} க்கு உடனடியாக செல்லுங்கள்.",
    voice:
      "கவனிங்கள். ResiliNet ஆரம்ப எச்சரிக்கை: திடீர் வெள்ள ஆபத்து. {node} இல் நீர்மட்டம் நிமிடத்திற்கு {rise} செண்டிமீட்டர் வேகத்தில் உயர்கிறது. " +
      "{village} அருகே தாழ்வான பகுதிகளிலிருந்து {shelter} க்கு உடனடியாக செல்லுங்கள்.",
    caption: "⚠ வெள்ள எச்சரிக்கை — {node} இல் +{rise} செமீ/நிமிடம். {village} அகற்றுங்கள்.",
  },
];

/**
 * Fill in template placeholders.
 * e.g. fillTemplate(msg.short, { node: "WS-001, Nainital Ridge", shelter: "Bhowali School" })
 */
export function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

/** Get messages for a given scenario */
export function getMessagesForScenario(
  scenarioId: ScenarioId
): AlertMessage[] {
  return ALERT_MESSAGES.filter((m) => m.scenarioId === scenarioId);
}
