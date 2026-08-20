import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: { home: "Home", about: "About", services: "Services", book: "Book", contact: "Contact", profile: "Profile", signIn: "Sign in", logout: "Logout", whatsapp: "WhatsApp Guruji" },
      footer: {
        tagline: "Traditional Vedic rituals performed with devotion and precision — bringing blessings of clarity, prosperity and peace to your home.",
        explore: "Explore", connect: "Connect",
        links: { about: "About the Pandit", services: "All Services", booking: "Book a Puja", contact: "Contact" },
      },
      common: { bookPuja: "Book a Puja", viewServices: "View services", readStory: "Read his story", allServices: "All services", from: "From", sending: "Sending...", send: "Send message", tryAgain: "Try again" },
      home: {
        eyebrow: "Vedic Rituals · Est. Tradition",
        h1a: "Where devotion meets", h1b: "tradition", h1c: ".",
        sub: "Authentic pujas and ceremonies performed by Pandit Ji — bringing blessings of clarity, prosperity and peace to every threshold.",
        stats: { years: "Years of seva", families: "Families served", rituals: "Rituals mastered" },
        scroll: "Scroll",
        philosophy: { eyebrow: "Our philosophy", title: "Ancient wisdom. Modern reverence.", body: "For over two decades, Pandit Ji has guided families through life's most sacred moments — from housewarmings and weddings to the quiet daily worship that anchors a home. Every ceremony is performed with strict Vedic adherence, clear explanation, and an unhurried sense of presence." },
        services: { eyebrow: "Sacred services", title: "Ceremonies we perform" },
        journey: { eyebrow: "Your sacred journey", title: "From sankalpa to aashirvaad", sub: "Every ceremony unfolds in four mindful movements." },
      },
      about: { eyebrow: "About", title: "A life devoted to seva." },
      services: { eyebrow: "Services", title: "Ceremonies for every sacred moment.", sub: "Every ritual is performed strictly as per Vedic vidhi, with all samagri arranged on your behalf.", book: "Book this" },
      booking: { eyebrow: "Booking", title: "Reserve your ceremony.", sub: "Share a few details about your occasion. Pandit Ji will confirm the muhurta and samagri within 24 hours.", fields: { service: "Service", date: "Date", time: "Preferred time", phone: "Phone", name: "Full name", address: "Address", notes: "Notes (optional)" }, cta: "Request booking", terms: "By booking, you agree to our terms of service." },
      contact: { eyebrow: "Contact", title: "We'd love to hear from you.", phone: "Phone", email: "Email", based: "Based in", note: "For urgent ceremonies, please call directly. For all other queries, kindly use the form and Pandit Ji's team will respond within 24 hours.", fields: { name: "Name", email: "Email", message: "Message" } },
      login: { welcome: "Welcome back", create: "Create your account", subLogin: "Sign in to view and manage your bookings.", subSignup: "Join us to begin your booking journey." },
      language: "Language",
      admin: {
        brand: "ADMIN", signOut: "Sign out",
        nav: { overview: "Overview", bookings: "Bookings", users: "Devotees", services: "Services" },
        gate: { restricted: "Access restricted", signIn: "Sign in required", restrictedBody: "This area is reserved for administrators. Redirecting…", signInBody: "Please sign in with an administrator account. Redirecting…", continue: "Continue" },
        metrics: { total: "Total bookings", confirmed: "Confirmed", devotees: "Devotees", revenue: "Revenue" },
        overview: { recent: "Recent bookings", recentCaption: "{{n}} most recent", distribution: "Status distribution", allTime: "All time", emptyBookings: "Bookings will appear here once devotees reserve a puja." },
        status: { confirmed: "Confirmed", pending: "Pending", cancelled: "Cancelled" },
        bookings: { showing: "Showing", of: "of", search: "Search name, email, service…", empty: "No bookings match your search.", cols: { devotee: "Devotee", service: "Service", date: "Date", status: "Status" }, actions: { confirm: "Confirm", cancel: "Cancel", delete: "Delete" } },
        users: { empty: "No registered devotees yet.", bookings_one: "{{count}} booking", bookings_other: "{{count}} bookings", last: "Last" },
        services: { active_one: "{{count}} active service", active_other: "{{count}} active services", newService: "New service", cancel: "Cancel", add: "Add", name: "Name", price: "Price (₹)", duration: "Duration", empty: "No services yet. Add your first one above.", errName: "Service name is required.", errPrice: "Enter a valid price.", confirmRemove: 'Remove "{{name}}"?' },
      },
    },
  },
  hi: {
    translation: {
      nav: { home: "मुख्य पृष्ठ", about: "परिचय", services: "सेवाएँ", book: "बुकिंग", contact: "संपर्क", profile: "प्रोफ़ाइल", signIn: "साइन इन", logout: "लॉगआउट", whatsapp: "गुरुजी से व्हाट्सऐप" },
      footer: {
        tagline: "पारंपरिक वैदिक अनुष्ठान भक्ति और सटीकता के साथ — आपके घर में स्पष्टता, समृद्धि और शांति का आशीर्वाद लाते हैं।",
        explore: "खोजें", connect: "संपर्क",
        links: { about: "पंडित जी के बारे में", services: "सभी सेवाएँ", booking: "पूजा बुक करें", contact: "संपर्क" },
      },
      common: { bookPuja: "पूजा बुक करें", viewServices: "सेवाएँ देखें", readStory: "उनकी कहानी पढ़ें", allServices: "सभी सेवाएँ", from: "से", sending: "भेजा जा रहा है...", send: "संदेश भेजें", tryAgain: "पुनः प्रयास करें" },
      home: {
        eyebrow: "वैदिक अनुष्ठान · प्राचीन परंपरा",
        h1a: "जहाँ भक्ति मिलती है", h1b: "परंपरा", h1c: " से।",
        sub: "पंडित जी द्वारा प्रामाणिक पूजा और अनुष्ठान — हर देहरी पर स्पष्टता, समृद्धि और शांति के आशीर्वाद।",
        stats: { years: "वर्षों की सेवा", families: "परिवारों की सेवा", rituals: "अनुष्ठानों में निपुणता" },
        scroll: "स्क्रॉल",
        philosophy: { eyebrow: "हमारा दर्शन", title: "प्राचीन ज्ञान। आधुनिक श्रद्धा।", body: "दो दशकों से अधिक समय से, पंडित जी ने परिवारों को जीवन के सबसे पवित्र क्षणों में मार्गदर्शन दिया है — गृह प्रवेश और विवाह से लेकर दैनिक पूजा तक। हर अनुष्ठान कठोर वैदिक विधि से किया जाता है।" },
        services: { eyebrow: "पवित्र सेवाएँ", title: "हम जो अनुष्ठान करते हैं" },
        journey: { eyebrow: "आपकी पवित्र यात्रा", title: "संकल्प से आशीर्वाद तक", sub: "हर अनुष्ठान चार चरणों में सम्पन्न होता है।" },
      },
      about: { eyebrow: "परिचय", title: "सेवा को समर्पित एक जीवन।" },
      services: { eyebrow: "सेवाएँ", title: "हर पावन अवसर के लिए अनुष्ठान।", sub: "हर अनुष्ठान वैदिक विधि के अनुसार किया जाता है, सभी सामग्री आपकी ओर से व्यवस्थित की जाती है।", book: "बुक करें" },
      booking: { eyebrow: "बुकिंग", title: "अपना अनुष्ठान बुक करें।", sub: "अपने अवसर का विवरण साझा करें। पंडित जी 24 घंटे में मुहूर्त और सामग्री की पुष्टि करेंगे।", fields: { service: "सेवा", date: "तिथि", time: "समय", phone: "फ़ोन", name: "पूरा नाम", address: "पता", notes: "टिप्पणी (वैकल्पिक)" }, cta: "बुकिंग का अनुरोध", terms: "बुकिंग करके आप हमारी सेवा शर्तों से सहमत हैं।" },
      contact: { eyebrow: "संपर्क", title: "हमें आपसे सुनकर खुशी होगी।", phone: "फ़ोन", email: "ईमेल", based: "स्थित", note: "तत्काल अनुष्ठानों के लिए कृपया सीधे कॉल करें। अन्य प्रश्नों के लिए कृपया फॉर्म का उपयोग करें।", fields: { name: "नाम", email: "ईमेल", message: "संदेश" } },
      login: { welcome: "पुनः स्वागत है", create: "खाता बनाएँ", subLogin: "अपनी बुकिंग देखने और प्रबंधित करने के लिए साइन इन करें।", subSignup: "अपनी बुकिंग यात्रा शुरू करने के लिए जुड़ें।" },
      language: "भाषा",
      admin: {
        brand: "एडमिन", signOut: "साइन आउट",
        nav: { overview: "अवलोकन", bookings: "बुकिंग", users: "भक्त", services: "सेवाएँ" },
        gate: { restricted: "प्रवेश प्रतिबंधित", signIn: "साइन इन आवश्यक", restrictedBody: "यह क्षेत्र केवल व्यवस्थापकों के लिए है। पुनर्निर्देशन…", signInBody: "कृपया व्यवस्थापक खाते से साइन इन करें। पुनर्निर्देशन…", continue: "जारी रखें" },
        metrics: { total: "कुल बुकिंग", confirmed: "पुष्ट", devotees: "भक्त", revenue: "राजस्व" },
        overview: { recent: "हाल की बुकिंग", recentCaption: "{{n}} सबसे हाल की", distribution: "स्थिति वितरण", allTime: "सर्वकालिक", emptyBookings: "जब भक्त पूजा बुक करेंगे तो बुकिंग यहाँ दिखेंगी।" },
        status: { confirmed: "पुष्ट", pending: "लंबित", cancelled: "रद्द" },
        bookings: { showing: "दिखाई जा रही", of: "में से", search: "नाम, ईमेल, सेवा खोजें…", empty: "कोई बुकिंग नहीं मिली।", cols: { devotee: "भक्त", service: "सेवा", date: "तिथि", status: "स्थिति" }, actions: { confirm: "पुष्टि", cancel: "रद्द", delete: "हटाएँ" } },
        users: { empty: "अभी कोई पंजीकृत भक्त नहीं।", bookings_one: "{{count}} बुकिंग", bookings_other: "{{count}} बुकिंग", last: "अंतिम" },
        services: { active_one: "{{count}} सक्रिय सेवा", active_other: "{{count}} सक्रिय सेवाएँ", newService: "नई सेवा", cancel: "रद्द", add: "जोड़ें", name: "नाम", price: "मूल्य (₹)", duration: "अवधि", empty: "अभी कोई सेवा नहीं। ऊपर पहली जोड़ें।", errName: "सेवा का नाम आवश्यक है।", errPrice: "मान्य मूल्य दर्ज करें।", confirmRemove: '"{{name}}" हटाएँ?' },
      },
    },
  },
  ta: {
    translation: {
      nav: { home: "முகப்பு", about: "பற்றி", services: "சேவைகள்", book: "பதிவு", contact: "தொடர்பு", profile: "சுயவிவரம்", signIn: "உள்நுழைய", logout: "வெளியேறு", whatsapp: "குருஜியுடன் WhatsApp" },
      footer: {
        tagline: "பாரம்பரிய வேத சடங்குகள் பக்தியுடனும் துல்லியத்துடனும் செய்யப்படுகின்றன — உங்கள் வீட்டிற்கு தெளிவு, செழிப்பு, அமைதியின் ஆசிகளை கொண்டுவருகின்றன.",
        explore: "ஆராய", connect: "தொடர்பு",
        links: { about: "பண்டிட் பற்றி", services: "அனைத்து சேவைகள்", booking: "பூஜை பதிவு", contact: "தொடர்பு" },
      },
      common: { bookPuja: "பூஜை பதிவு செய்யவும்", viewServices: "சேவைகளை பார்க்க", readStory: "அவரது கதையை வாசிக்க", allServices: "அனைத்து சேவைகள்", from: "முதல்", sending: "அனுப்புகிறது...", send: "செய்தி அனுப்பு", tryAgain: "மீண்டும் முயற்சி" },
      home: {
        eyebrow: "வேத சடங்குகள் · பாரம்பரியம்",
        h1a: "பக்தி சந்திக்கும்", h1b: "பாரம்பரியம்", h1c: ".",
        sub: "பண்டிட் ஜியால் நிகழ்த்தப்படும் உண்மையான பூஜைகள் — ஒவ்வொரு வாசலிலும் தெளிவு, செழிப்பு, அமைதி.",
        stats: { years: "ஆண்டுகள் சேவை", families: "குடும்பங்களுக்கு சேவை", rituals: "சடங்குகளில் தேர்ச்சி" },
        scroll: "ஸ்க்ரோல்",
        philosophy: { eyebrow: "எங்கள் தத்துவம்", title: "பழமை ஞானம். நவீன பக்தி.", body: "இரண்டு தசாப்தங்களாக, பண்டிட் ஜி குடும்பங்களை வாழ்க்கையின் புனிதமான தருணங்களில் வழிநடத்துகிறார்." },
        services: { eyebrow: "புனித சேவைகள்", title: "நாங்கள் நிகழ்த்தும் சடங்குகள்" },
        journey: { eyebrow: "உங்கள் புனித பயணம்", title: "சங்கல்பம் முதல் ஆசீர்வாதம் வரை", sub: "ஒவ்வொரு சடங்கும் நான்கு படிகளில் நிகழ்கிறது." },
      },
      about: { eyebrow: "பற்றி", title: "சேவைக்கு அர்ப்பணித்த வாழ்க்கை." },
      services: { eyebrow: "சேவைகள்", title: "ஒவ்வொரு புனித தருணத்திற்கும் சடங்குகள்.", sub: "ஒவ்வொரு சடங்கும் வேத விதிப்படி நிகழ்த்தப்படுகிறது, அனைத்து சாமான்களும் உங்களுக்காக ஏற்பாடு செய்யப்படுகின்றன.", book: "பதிவு செய்" },
      booking: { eyebrow: "பதிவு", title: "உங்கள் சடங்கை பதிவு செய்யுங்கள்.", sub: "உங்கள் நிகழ்வைப் பற்றிய சில விவரங்களை பகிரவும். பண்டிட் ஜி 24 மணி நேரத்தில் முகூர்த்தம் உறுதிசெய்வார்.", fields: { service: "சேவை", date: "தேதி", time: "நேரம்", phone: "தொலைபேசி", name: "முழு பெயர்", address: "முகவரி", notes: "குறிப்புகள் (விருப்பம்)" }, cta: "பதிவு கோரிக்கை", terms: "பதிவு செய்வதன் மூலம், எங்கள் விதிமுறைகளை ஒப்புக்கொள்கிறீர்கள்." },
      contact: { eyebrow: "தொடர்பு", title: "உங்களிடமிருந்து கேட்க விரும்புகிறோம்.", phone: "தொலைபேசி", email: "மின்னஞ்சல்", based: "அமைந்துள்ளது", note: "அவசர சடங்குகளுக்கு நேரடியாக அழைக்கவும்.", fields: { name: "பெயர்", email: "மின்னஞ்சல்", message: "செய்தி" } },
      login: { welcome: "மீண்டும் வரவேற்கிறோம்", create: "கணக்கை உருவாக்கு", subLogin: "உங்கள் பதிவுகளைப் பார்க்க உள்நுழையவும்.", subSignup: "உங்கள் பதிவு பயணத்தை தொடங்க இணையுங்கள்." },
      language: "மொழி",
      admin: {
        brand: "நிர்வாகி", signOut: "வெளியேறு",
        nav: { overview: "மேலோட்டம்", bookings: "பதிவுகள்", users: "பக்தர்கள்", services: "சேவைகள்" },
        gate: { restricted: "அணுகல் கட்டுப்படுத்தப்பட்டது", signIn: "உள்நுழைவு தேவை", restrictedBody: "இந்த பகுதி நிர்வாகிகளுக்கானது. திருப்பி அனுப்புகிறது…", signInBody: "தயவுசெய்து நிர்வாகி கணக்குடன் உள்நுழையவும்.", continue: "தொடரவும்" },
        metrics: { total: "மொத்த பதிவுகள்", confirmed: "உறுதி", devotees: "பக்தர்கள்", revenue: "வருவாய்" },
        overview: { recent: "சமீபத்திய பதிவுகள்", recentCaption: "{{n}} சமீபத்தியவை", distribution: "நிலை விநியோகம்", allTime: "எல்லா காலமும்", emptyBookings: "பக்தர்கள் பதிவு செய்தவுடன் இங்கே தோன்றும்." },
        status: { confirmed: "உறுதி", pending: "நிலுவையில்", cancelled: "ரத்து" },
        bookings: { showing: "காட்டுகிறது", of: "மொத்தம்", search: "பெயர், மின்னஞ்சல், சேவை…", empty: "பதிவுகள் இல்லை.", cols: { devotee: "பக்தர்", service: "சேவை", date: "தேதி", status: "நிலை" }, actions: { confirm: "உறுதி", cancel: "ரத்து", delete: "நீக்கு" } },
        users: { empty: "இன்னும் பதிவு பக்தர்கள் இல்லை.", bookings_one: "{{count}} பதிவு", bookings_other: "{{count}} பதிவுகள்", last: "கடைசி" },
        services: { active_one: "{{count}} செயலில் சேவை", active_other: "{{count}} செயலில் சேவைகள்", newService: "புதிய சேவை", cancel: "ரத்து", add: "சேர்", name: "பெயர்", price: "விலை (₹)", duration: "காலம்", empty: "சேவைகள் இல்லை.", errName: "சேவை பெயர் தேவை.", errPrice: "சரியான விலை.", confirmRemove: '"{{name}}" அகற்ற?' },
      },
    },
  },
  mr: {
    translation: {
      nav: { home: "मुख्यपृष्ठ", about: "परिचय", services: "सेवा", book: "बुकिंग", contact: "संपर्क", profile: "प्रोफाइल", signIn: "साइन इन", logout: "लॉगआउट", whatsapp: "गुरुजींना WhatsApp" },
      footer: {
        tagline: "पारंपारिक वैदिक विधी भक्ती आणि अचूकतेने केले जातात — आपल्या घरात स्पष्टता, समृद्धी आणि शांतीचे आशीर्वाद आणतात.",
        explore: "एक्सप्लोर", connect: "संपर्क",
        links: { about: "पंडितजींबद्दल", services: "सर्व सेवा", booking: "पूजा बुक करा", contact: "संपर्क" },
      },
      common: { bookPuja: "पूजा बुक करा", viewServices: "सेवा पहा", readStory: "त्यांची कहाणी वाचा", allServices: "सर्व सेवा", from: "पासून", sending: "पाठवत आहे...", send: "संदेश पाठवा", tryAgain: "पुन्हा प्रयत्न करा" },
      home: {
        eyebrow: "वैदिक विधी · परंपरा",
        h1a: "जिथे भक्ती भेटते", h1b: "परंपरेला", h1c: ".",
        sub: "पंडितजींद्वारे प्रामाणिक पूजा आणि विधी — प्रत्येक उंबरठ्यावर स्पष्टता, समृद्धी आणि शांतीचे आशीर्वाद.",
        stats: { years: "वर्षांची सेवा", families: "कुटुंबांची सेवा", rituals: "विधींमध्ये प्रावीण्य" },
        scroll: "स्क्रोल",
        philosophy: { eyebrow: "आमचे तत्त्वज्ञान", title: "प्राचीन ज्ञान. आधुनिक श्रद्धा.", body: "दोन दशकांहून अधिक काळ, पंडितजींनी कुटुंबांना जीवनातील पवित्र क्षणांमधून मार्गदर्शन केले आहे." },
        services: { eyebrow: "पवित्र सेवा", title: "आम्ही करत असलेले विधी" },
        journey: { eyebrow: "तुमचा पवित्र प्रवास", title: "संकल्पापासून आशीर्वादापर्यंत", sub: "प्रत्येक विधी चार टप्प्यांत पूर्ण होतो." },
      },
      about: { eyebrow: "परिचय", title: "सेवेला समर्पित एक जीवन." },
      services: { eyebrow: "सेवा", title: "प्रत्येक पवित्र क्षणासाठी विधी.", sub: "प्रत्येक विधी वैदिक विधीनुसार केला जातो, सर्व साहित्य आपल्यासाठी व्यवस्थित केले जाते.", book: "बुक करा" },
      booking: { eyebrow: "बुकिंग", title: "आपला विधी आरक्षित करा.", sub: "आपल्या प्रसंगाबद्दल काही तपशील सामायिक करा. पंडितजी 24 तासांत मुहूर्त निश्चित करतील.", fields: { service: "सेवा", date: "तारीख", time: "वेळ", phone: "फोन", name: "पूर्ण नाव", address: "पत्ता", notes: "टीप (पर्यायी)" }, cta: "बुकिंग विनंती", terms: "बुक करून, आपण आमच्या अटी मान्य करता." },
      contact: { eyebrow: "संपर्क", title: "आम्हाला आपल्याकडून ऐकायला आवडेल.", phone: "फोन", email: "ईमेल", based: "स्थित", note: "तातडीच्या विधींसाठी कृपया थेट कॉल करा.", fields: { name: "नाव", email: "ईमेल", message: "संदेश" } },
      login: { welcome: "पुन्हा स्वागत आहे", create: "खाते तयार करा", subLogin: "आपले बुकिंग व्यवस्थापित करण्यासाठी साइन इन करा.", subSignup: "आपला बुकिंग प्रवास सुरू करण्यासाठी सामील व्हा." },
      language: "भाषा",
      admin: {
        brand: "अ‍ॅडमिन", signOut: "साइन आउट",
        nav: { overview: "अवलोकन", bookings: "बुकिंग", users: "भक्त", services: "सेवा" },
        gate: { restricted: "प्रवेश प्रतिबंधित", signIn: "साइन इन आवश्यक", restrictedBody: "हे क्षेत्र फक्त प्रशासकांसाठी आहे.", signInBody: "कृपया प्रशासक खात्याने साइन इन करा.", continue: "सुरू ठेवा" },
        metrics: { total: "एकूण बुकिंग", confirmed: "पुष्ट", devotees: "भक्त", revenue: "महसूल" },
        overview: { recent: "अलीकडील बुकिंग", recentCaption: "{{n}} अलीकडील", distribution: "स्थिती वितरण", allTime: "सर्वकाळ", emptyBookings: "भक्तांनी पूजा बुक केल्यावर येथे दिसेल." },
        status: { confirmed: "पुष्ट", pending: "प्रलंबित", cancelled: "रद्द" },
        bookings: { showing: "दर्शवित आहे", of: "पैकी", search: "नाव, ईमेल, सेवा…", empty: "बुकिंग सापडली नाही.", cols: { devotee: "भक्त", service: "सेवा", date: "तारीख", status: "स्थिती" }, actions: { confirm: "पुष्टी", cancel: "रद्द", delete: "हटवा" } },
        users: { empty: "अद्याप नोंदणीकृत भक्त नाहीत.", bookings_one: "{{count}} बुकिंग", bookings_other: "{{count}} बुकिंग्स", last: "शेवटचे" },
        services: { active_one: "{{count}} सक्रिय सेवा", active_other: "{{count}} सक्रिय सेवा", newService: "नवीन सेवा", cancel: "रद्द", add: "जोडा", name: "नाव", price: "किंमत (₹)", duration: "कालावधी", empty: "सेवा नाहीत.", errName: "सेवा नाव आवश्यक.", errPrice: "वैध किंमत.", confirmRemove: '"{{name}}" काढायचे?' },
      },
    },
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: "en",
      fallbackLng: "en",
      supportedLngs: ["en", "hi", "ta", "mr"],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "हि" },
  { code: "ta", label: "தமிழ்", short: "த" },
  { code: "mr", label: "मराठी", short: "म" },
];

// Apply persisted language on the client only (after hydration).
export function applyPersistedLanguage() {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("divya_lang");
    if (saved && saved !== i18n.language && ["en", "hi", "ta", "mr"].includes(saved)) {
      i18n.changeLanguage(saved);
    }
  } catch {}
}

export default i18n;

