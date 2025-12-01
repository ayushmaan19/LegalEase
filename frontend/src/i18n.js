import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// The translation JSON objects
const resources = {
  en: {
    translation: {
      aiAssistant: {
        title: "AI Legal Assistant",
        subtitle: "Digital Legal Aid",
        newChat: "New Chat",
        inputPlaceholder: "Ask your legal question...",
      },
      sidebar: {
        languageTitle: "Language / भाषा",
        sampleQuestionsTitle: "Sample Questions",
        questions: {
          q1: "What are my rights as a tenant?",
          q2: "How do I file for divorce?",
          q3: "What should I do if I'm falsely accused?",
          q4: "How can I claim insurance?",
        },
        legalTopicsTitle: "Legal Topics",
        topics: {
          family: "Family Law",
          property: "Property Law",
          criminal: "Criminal Law",
          labor: "Labor Rights",
          consumer: "Consumer Protection",
          civil: "Civil Rights",
          taxation: "Taxation",
          other: "Other",
        },
        noticeTitle: "Important Notice",
        noticeText:
          "This AI assistant provides legal guidance only. For serious legal matters, please consult with a verified lawyer through our platform.",
      },
    },
  },
  hi: {
    translation: {
      aiAssistant: {
        title: "AI कानूनी सहायक",
        subtitle: "डिजिटल कानूनी सहायता",
        newChat: "+ नई चैट",
        inputPlaceholder: "अपनी कानूनी प्रश्न पूछें...",
      },
      sidebar: {
        languageTitle: "Language / भाषा",
        sampleQuestionsTitle: "नमूना प्रश्न",
        questions: {
          q1: "किरायेदार के रूप में मेरे अधिकार क्या हैं?",
          q2: "मैं तलाक के लिए कैसे अर्जी दूं?",
          q3: "अगर मुझ पर झूठा आरोप लगाया जाए तो मुझे क्या करना चाहिए?",
          q4: "मैं बीमा का दावा कैसे कर सकता हूँ?",
        },
        legalTopicsTitle: "कानूनी विषय",
        topics: {
          family: "पारिवारिक कानून",
          property: "संपत्ति कानून",
          criminal: "आपराधिक कानून",
          labor: "श्रम अधिकार",
          consumer: "उपभोक्ता संरक्षण",
          civil: "नागरिक अधिकार",
          taxation: "कराधान",
          other: "अन्य",
        },
        noticeTitle: "महत्वपूर्ण सूचना",
        noticeText:
          "यह AI सहायक केवल कानूनी मार्गदर्शन प्रदान करता है। गंभीर कानूनी मामलों के लिए, कृपया हमारे मंच के माध्यम से एक सत्यापित वकील से परामर्श करें।",
      },
    },
  },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Use English if detected language is not available
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
