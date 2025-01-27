import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import Navbar from "../Components/Navbar/Navbar";

const faqs = [
  {
    id: 1,
    question: "אילו שירותים אתם מציעים ב-'Easy Gift'?",
    answer:
      "האתר שלנו מציע העברת מתנות לאירועים בצורה פשוטה ונקייה. בנוסף, הוא מציע שירותי סיכום לקבלת מתנות או הוספת אירוע חדש בהתאם לרמת ההרשמה במערכת (אורח, משתמש רשום, בעל אירוע, אדמין).",
  },
  {
    id: 2,
    question: "מהי שיטת התשלום המועדפת שלנו?",
    answer:
      "האתר מציע כרגע אפשרות אחת לתשלום דרך PayPal בדולרים. בגרסה הבאה יהיו עוד אפשרויות של סוגי מטבעות ו-API נוספים.",
  },
  {
    id: 3,
    question: "כיצד אני פותח חשבון?",
    answer:
      "בעמוד הראשון של האתר ישנן 4 אפשרויות הרשמה: הראשונה למי שכבר רשום, השנייה להרשמה חדשה, השלישית לאורחים, והרביעית לבעלי אירועים.",
  },
  {
    id: 4,
    question: "כיצד אני עוקב אחר כמה אנשים שלחו מתנות?",
    answer:
      "לאורח אין אפשרות כזו. משתמש רשום יכול לראות בדף ההיסטוריה (נמצא בסרגל הניווט למעלה) סיכום של כל המתנות, באיזה אירוע, תאריכים, סכומים ואיזו ברכה נשלחה.",
  },
  {
    id: 5,
    question: "היכן נמצאים המשרדים שלכם ברחבי העולם?",
    answer: "כרגע בישראל בלבד. אנחנו מקווים להתרחב לכל העולם בעתיד.",
  },
  {
    id: 6,
    question: "כיצד אני פותח אירוע חדש?",
    answer:
      "לאחר כניסה לאתר כבעל אירוע, בדף הוספת אירועים יש כפתור להוספת אירוע חדש ולמילוי כל הפרטים הנדרשים.",
  },
  {
    id: 7,
    question: "האם אני יכול לבטל מתנה?",
    answer: "לא, ייתכן שתהיה אפשרות כזו בגרסה הבאה.",
  },
  {
    id: 8,
    question: "כיצד אני מתחיל להשתמש ב-'Easy Gift'?",
    answer: "נכנסים לאתר, נרשמים או כאורח, ממלאים את הפרטים הנדרשים ושולחים.",
  },
  {
    id: 9,
    question: "כיצד אני מוריד את אפליקציית 'Easy Gift'?",
    answer:
      "כרגע, לצערנו, אין אפליקציה, אבל אנחנו עובדים על גרסה אפליקטיבית שתהיה זמינה בקרוב.",
  },
  {
    id: 10,
    question: "אילו מכשירים נתמכים על ידי 'Easy Gift'?",
    answer: "כרגע, הדרך המועדפת והנקייה ביותר היא דרך מחשב או לפטופ.",
  },
  {
    id: 11,
    question: "מהן דרישות המערכת עבור 'Easy Gift'?",
    answer: "שם, אימייל, סיסמה, מספר טלפון, פרטי אשראי או חשבון PayPal.",
  },
  {
    id: 12,
    question: "מיהו קהל היעד של 'Easy Gift'?",
    answer: "כל מי שצריך ויש לו גישה לכרטיס אשראי או חשבון PayPal.",
  },
  {
    id: 13,
    question: "כיצד אני משנה את השפה?",
    answer:
      "כפתור בסרגל הניווט למעלה בצד ימין. כרגע האתר זמין רק באנגלית, תהיה גם עברית בגרסה הבאה.",
  },
  {
    id: 14,
    question: "כיצד אני מאפס את הסיסמה שלי?",
    answer:
      "ניתן לאפס את הסיסמה על ידי לחיצה על 'שכחתי סיסמה' בדף ההתחברות ומעקב אחר ההוראות.",
  },
  {
    id: 15,
    question: "כיצד אני מעדכן את הפרופיל/החשבון שלי?",
    answer: "ניתן לעדכן את הפרופיל על ידי כניסה להגדרות החשבון לאחר ההתחברות.",
  },
  {
    id: 16,
    question: "אני לא מצליח לפתור את הבעיה, מה עליי לעשות?",
    answer:
      "ניתן לפנות לתמיכה שלנו דרך דף יצירת הקשר או לשלוח מייל לכתובת support@example.com.",
  },
  {
    id: 17,
    question: "מהן הדרישות לשימוש ב-'Easy Gift'?",
    answer: "יש צורך בחיבור לאינטרנט, דפדפן עדכני, ופרטי תשלום תקינים.",
  },
  {
    id: 18,
    question: "מה אני יכול/לא יכול לעשות ב-'Easy Gift'?",
    answer:
      "ניתן לשלוח מתנות, להוסיף אירועים (לבעלי אירוע), ולצפות בהיסטוריית המתנות (למשתמשים רשומים). כרגע לא ניתן לבטל מתנות או לערוך אירועים לאחר הוספתם.",
  },
  {
    id: 19,
    question: "מהן הגבלות הגיל לשימוש ב-'Easy Gift'?",
    answer:
      "משתמשים חייבים להיות בני 18 ומעלה, או להשתמש בהשגחת הורה או אפוטרופוס.",
  },
  {
    id: 20,
    question: "האם אני יכול לשנות את הברכות שלי?",
    answer:
      "כרגע לא ניתן לערוך ברכות לאחר שליחתן. ייתכן שתהיה אפשרות כזו בגרסה הבאה.",
  },
  {
    id: 21,
    question: "כרטיס האשראי שלי נדחה, מה עליי לעשות?",
    answer:
      "אנא בדוק שהפרטים שהזנת נכונים, ושיש לך מספיק יתרה. אם הבעיה נמשכת, פנה לחברת האשראי שלך או השתמש באמצעי תשלום אחר.",
  },
  // שאלות נוספות:
  {
    id: 22,
    question: "האם המידע האישי שלי מאובטח ב-'Easy Gift'?",
    answer:
      "כן, אנו משתמשים בפרוטוקולי אבטחה מתקדמים כדי להבטיח שהמידע האישי שלך מוגן.",
  },
  {
    id: 23,
    question: "כיצד אני פונה לתמיכת הלקוחות?",
    answer:
      "ניתן לפנות אלינו דרך דף 'צור קשר' באתר או לשלוח מייל לכתובת support@example.com.",
  },
  {
    id: 24,
    question: "האם אני יכול להשתמש ב-'Easy Gift' מהמכשיר הנייד שלי?",
    answer:
      "כן, האתר מותאם למכשירים ניידים, אך החוויה הטובה ביותר היא דרך מחשב או לפטופ.",
  },
  {
    id: 25,
    question: "איזה מטבעות מתקבלים?",
    answer:
      "כרגע, התשלומים מתבצעים בדולרים דרך PayPal. בעתיד נרחיב את התמיכה במטבעות נוספים.",
  },
  {
    id: 26,
    question: "כיצד אני מזמין אורחים לאירוע שלי?",
    answer:
      "לאחר יצירת האירוע, תוכל לשלוח קישורים לאורחים כדי שיצטרפו וישלחו מתנות.",
  },
  {
    id: 27,
    question: "האם אני יכול לראות מי שלח לי מתנות?",
    answer: "כן, כבעל אירוע, תוכל לראות רשימה של כל המתנות שנשלחו ואת השולחים.",
  },
  {
    id: 28,
    question: "מה אם שכחתי את שם המשתמש שלי?",
    answer: "ניתן להשתמש באימייל הרשום שלך כדי להתחבר או לפנות לתמיכה שלנו.",
  },
  {
    id: 29,
    question: "כיצד אני מוחק את החשבון שלי?",
    answer: "אם ברצונך למחוק את חשבונך, פנה לתמיכה שלנו ואנו נעזור לך בתהליך.",
  },
  {
    id: 30,
    question: "האם יש עמלות על השימוש ב-'Easy Gift'?",
    answer:
      "השימוש באתר הוא חינמי. עם זאת, עשויות להיות עמלות תשלום מצד PayPal או חברות האשראי.",
  },
  {
    id: 31,
    question: "האם אני יכול להתאים אישית את המראה של דף האירוע שלי?",
    answer:
      "כרגע, האפשרויות להתאמה אישית מוגבלות. אנו עובדים על הוספת אפשרויות נוספות בעתיד.",
  },
  {
    id: 32,
    question: "האם יש הגבלה לסכום שאני יכול לשלוח כמתנה?",
    answer:
      "לא, אין הגבלה לסכום, אך ייתכן ויהיו הגבלות מצד חברת האשראי או PayPal.",
  },
  {
    id: 33,
    question: "כיצד אני יודע אם המתנה שלי התקבלה?",
    answer: "לאחר השלמת התשלום, תקבל אישור במייל שהמתנה נשלחה בהצלחה.",
  },
  {
    id: 34,
    question: "האם אני יכול לתזמן מתנה להישלח במועד מאוחר יותר?",
    answer: "כרגע אין אפשרות לתזמן מתנות. יש לשלוח את המתנה בזמן אמת.",
  },
  {
    id: 35,
    question: "מה אם טעיתי בסכום המתנה?",
    answer: "אנא פנה לתמיכה שלנו וננסה לסייע לך ככל האפשר.",
  },
  {
    id: 36,
    question: "האם אתם תומכים בעסקאות בינלאומיות?",
    answer: "כן, דרך PayPal ניתן לבצע תשלומים בינלאומיים.",
  },
  {
    id: 37,
    question: "האם אני יכול לקשר מספר אירועים לחשבון שלי?",
    answer: "כן, כבעל אירוע, ניתן ליצור ולנהל מספר אירועים דרך החשבון שלך.",
  },
  {
    id: 38,
    question: "כיצד אני משנה את כתובת האימייל שלי?",
    answer: "ניתן לעדכן את כתובת האימייל שלך בהגדרות החשבון.",
  },
  {
    id: 39,
    question: "האם יש דרך לצפות בתצוגה מקדימה של דף האירוע לפני הפרסום?",
    answer: "כן, יש אפשרות לצפות בתצוגה מקדימה לפני שהאירוע הופך לפעיל.",
  },
  {
    id: 40,
    question: "האם אני יכול לקבל התראות על מתנות חדשות?",
    answer: "כן, ניתן להפעיל התראות במייל דרך הגדרות החשבון.",
  },
];

export default function FaqPage() {
  return (
    <div dir="rtl">
      <Navbar />
      <Box
        sx={{
          paddingTop: "100px",
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "370%",
          zIndex: -1,
          background: "linear-gradient(135deg, #0D1B2A, #1B263B)",
          backgroundSize: "400% 400%",
          animation: "animateBg 15s ease infinite",
        }}
      />
      <Typography
        variant="h1"
        gutterBottom
        align="center"
        sx={{
          paddingTop: "120px",
          fontWeight: "bold",
          marginBottom: "40px",
          color: "#1976D2",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        שאלות ותשובות נפוצות
      </Typography>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: "30px",
          marginBottom: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
            background: "linear-gradient(135deg, #ffffff, #e0f7fa)",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.3)",
            },
            marginBottom: "30px",
          }}
        >
          <Box sx={{ width: "100%" }}>
            {faqs.map((faq) => (
              <Paper
                key={faq.id}
                elevation={3}
                sx={{
                  marginBottom: "20px",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <Accordion
                  sx={{
                    backgroundColor: "#e3f2fd",
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#1976D2" }} />}
                    aria-controls={`faq-content-${faq.id}`}
                    id={`faq-header-${faq.id}`}
                  >
                    <Typography sx={{ fontWeight: "bold", color: "#0d47a1" }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: "#424242" }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Container>
      {/* Footer פשוט בתחתית העמוד */}
      <Box
        sx={{
          marginTop: 5,
          textAlign: "center",
          py: 1.5,
          backgroundColor: "rgba(0,0,0,0.3)",
          color: "#E0E1DD",
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
          &copy; {new Date().getFullYear()} EASY GIFT | כל הזכויות שמורות
        </Typography>
      </Box>
    </div>
  );
}
