
import { AnalysisResult, Language, Platform } from "./types";

// Adding Hebrew translations to match Language type definition and satisfy Record requirements
const PLATFORM_DATA: Record<Language, any> = {
  ar: {
    instagram: {
      problems: [
        "ضعف في 'الكلمات الافتتاحية' (Keywords) في البايو، مما يجعل الحساب غير مرئي لمحركات بحث انستقرام.",
        "تنسيق الألوان (Color Palette) في الـ Grid غير متناسق، مما يقلل من نسبة تحويل المشاهدين إلى متابعين.",
        "استخدام هاشتاقات عامة جداً (Generic Hashtags) تؤدي لتصنيف المحتوى كـ Spam من قبل الخوارزمية."
      ],
      solutions: [
        "تحويل الحساب إلى 'Professional Account' وتفعيل خيار 'Digital Creator' لزيادة الوصول.",
        "استخدام قاعدة الـ 9 مربعات لتنظيم الصور بشكل بصري مريح للعين.",
        "كتابة أول سطرين في المنشور بطريقة تثير الفضول (Hook Lines)."
      ]
    },
    tiktok: {
      problems: [
        "إهمال الـ 'Trend Sounds' في أول 48 ساعة من صدورها، مما يفقدك زخم الانتشار السريع.",
        "جودة الإضاءة في فيديوهاتك تعطي إشارة للخوارزمية بأن المحتوى ذو جودة منخفضة (Low Quality).",
        "تجاوز مدة الفيديو لـ 15 ثانية دون وجود 'صدمة بصرية' في البداية."
      ],
      solutions: [
        "التفاعل مع أول 10 تعليقات فور النشر لرفع تقييم الفيديو (Engagement Velocity).",
        "استخدم نصوصاً كبيرة وواضحة (Overlays) تشرح الفائدة من الفيديو في أول ثانية.",
        "النشر في أوقات الذروة المحلية لبلدك لضمان الدخول في الـ FYP."
      ]
    },
    generic: {
      problems: ["ضعف عام في هوية العلامة التجارية الشخصية.", "غياب التفاعل مع المنافسين في نفس المجال.", "عدم وضوح القيمة المضافة للمتابع."],
      solutions: ["تثبيت 3 منشورات توضح من أنت وماذا تقدم.", "استخدام ستوري تفاعلي يومي (استطلاعات رأي).", "تحسين جودة الصوت كأولوية أولى."]
    },
    verdicts: [
      "حسابك يحتاج إلى إعادة ضبط مصنع (Brand Reset). المحتوى جيد لكن التغليف سيء.",
      "أنت قريب جداً من الانفجار، فقط تحتاج لتعديل الـ SEO الخاص بالحساب.",
      "الخوارزمية حالياً تتجاهل محتواك بسبب تكرار الأخطاء التقنية في النشر."
    ]
  },
  en: {
    instagram: {
      problems: ["Bio keywords missing for Instagram SEO.", "Inconsistent Grid aesthetic.", "Over-use of saturated hashtags."],
      solutions: ["Switch to Professional/Creator mode.", "Apply a 9-grid visual strategy.", "Optimize caption hooks."]
    },
    tiktok: {
      problems: ["Ignoring trending audio peaks.", "Poor lighting flagging content as Low Quality.", "Lack of high-retention editing."],
      solutions: ["Engage within 1-hour of posting.", "Use bold on-screen text overlays.", "Post during local peak traffic hours."]
    },
    generic: {
      problems: ["Weak personal branding.", "Lack of competitor networking.", "Undefined value proposition."],
      solutions: ["Pin 3 high-value introduction posts.", "Run daily interactive stories.", "Invest in better audio gear."]
    },
    verdicts: ["High potential, but technically invisible.", "Algorithmic plateau reached.", "Content is great, packaging needs work."]
  },
  he: {
    instagram: {
      problems: [
        "חסרים מילות מפתח (Keywords) בביו לקידום SEO באינסטגרם.",
        "אסתטיקה לא עקבית של ה-Grid.",
        "שימוש יתר בהאשטאגים רווים מדי שפוגעים בחשיפה."
      ],
      solutions: [
        "העבר למצב Professional/Creator והפעל Digital Creator.",
        "החל אסטרטגיה ויזואלית של 9 משבצות לארגון הפיד.",
        "אופטימיזציה של ה-'Hook' בשורות הראשונות של הכיתוב."
      ]
    },
    tiktok: {
      problems: [
        "התעלמות משיאי טרנדים של אודיו ב-48 השעות הראשונות.",
        "תאורה גרועה המסמנת את התוכן כאיכות נמוכה לאלגוריתם.",
        "חוסר בעריכה מהירה ושומרת עניין בתחילת הסרטון."
      ],
      solutions: [
        "צור אינטראקציה עם התגובות הראשונות להעלאת הדירוג.",
        "השתמש בטקסט בולט על המסך שמסביר את הערך מיידית.",
        "פרסם בשעות שיא התנועה המקומיות לכניסה ל-FYP."
      ]
    },
    generic: {
      problems: ["מיתוג אישי חלש.", "חוסר באינטראקציה עם מתחרים בתחום.", "הצעת ערך לא ברורה לעוקבים."],
      solutions: ["נעץ 3 פוסטים של הקדמה וערך בראש הפרופיל.", "נהל סטוריז אינטראקטיביים יומיים.", "השקע בשיפור איכות הסאונד כעדיפות עליונה."]
    },
    verdicts: ["פוטנציאל גבוה, אך בלתי נראה טכנית כרגע.", "הגעת למישור אלגוריתמי עקב חזרתיות.", "התוכן נהדר, אך האריזה והקידום זקוקים לשיפור."]
  }
};

export const analyzeProfileLocal = (input: string, platform: Platform, lang: Language): AnalysisResult => {
  // Deterministic logic based on input string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0; 
  }
  const seed = Math.abs(hash);
  const growthScore = 25 + (seed % 70); // 25-95%
  
  const currentLang = PLATFORM_DATA[lang] || PLATFORM_DATA['en'];
  const platKey = platform.includes('instagram') ? 'instagram' : platform === 'tiktok' ? 'tiktok' : 'generic';
  const data = currentLang[platKey];
  
  return {
    growthScore,
    problems: [data.problems[seed % 3], data.problems[(seed+1) % 3], currentLang.generic.problems[seed % 3]],
    solutions: [data.solutions[seed % 3], data.solutions[(seed+1) % 3], currentLang.generic.solutions[seed % 3]],
    verdict: currentLang.verdicts[seed % (currentLang.verdicts.length)]
  };
};
