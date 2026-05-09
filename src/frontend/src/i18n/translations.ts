import type { Language } from "../contexts/LanguageContext";

export type TranslationKey =
  | "app.name"
  | "nav.feed"
  | "nav.products"
  | "nav.tips"
  | "nav.quiz"
  | "nav.sites"
  | "nav.badges"
  | "nav.scams"
  | "nav.arabic"
  | "nav.premium"
  | "profile.title"
  | "profile.identifiant"
  | "profile.username"
  | "profile.country"
  | "profile.email"
  | "profile.language"
  | "profile.account"
  | "profile.stats"
  | "profile.badges"
  | "profile.points"
  | "profile.quizScore"
  | "profile.tipsGiven"
  | "profile.scamsReported"
  | "profile.notLoggedIn"
  | "btn.save"
  | "btn.cancel"
  | "btn.edit"
  | "btn.delete"
  | "btn.connect"
  | "btn.disconnect"
  | "lang.ar"
  | "lang.es"
  | "lang.fr"
  | "common.loading"
  | "common.error"
  | "common.empty"
  | "nav.reclamations"
  | "reclamations.title"
  | "reclamations.empty"
  | "reclamations.report"
  | "reclamations.description"
  | "reclamations.whatTheySell"
  | "reclamations.city"
  | "reclamations.location"
  | "reclamations.warning"
  | "reclamations.helpful"
  | "reclamations.descriptionPlaceholder"
  | "reclamations.submitSuccess"
  | "tips.filterCity"
  | "tips.filterLocation"
  | "tips.all"
  | "tips.addTip"
  | "tips.titleLabel"
  | "tips.cityLabel"
  | "tips.locationLabel"
  | "tips.contentLabel";

type Translations = Record<Language, Record<TranslationKey, string>>;

export const translations: Translations = {
  fr: {
    "app.name": "No More Scam",
    "nav.feed": "Feed",
    "nav.products": "Produits",
    "nav.tips": "Conseils",
    "nav.quiz": "Quiz",
    "nav.sites": "Sites",
    "nav.badges": "Badges",
    "nav.scams": "Arnaques",
    "nav.arabic": "Apprendre l'arabe",
    "nav.premium": "Get Premium",
    "profile.title": "Mon Profil",
    "profile.identifiant": "Mon Identifiant",
    "profile.username": "Nom d'utilisateur",
    "profile.country": "Pays",
    "profile.email": "Email",
    "profile.language": "Langue",
    "profile.account": "Informations du compte",
    "profile.stats": "Statistiques & Progression",
    "profile.badges": "Badges obtenus",
    "profile.points": "Points",
    "profile.quizScore": "Score Quiz",
    "profile.tipsGiven": "Conseils donnés",
    "profile.scamsReported": "Arnaques signalées",
    "profile.notLoggedIn": "Veuillez vous connecter pour voir votre profil.",
    "btn.save": "Enregistrer",
    "btn.cancel": "Annuler",
    "btn.edit": "Modifier",
    "btn.delete": "Supprimer",
    "btn.connect": "Connexion",
    "btn.disconnect": "Déconnexion",
    "lang.ar": "العربية",
    "lang.es": "Español",
    "lang.fr": "Français",
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.empty": "Aucun contenu disponible",
    "nav.reclamations": "Réclamations",
    "reclamations.title": "Réclamations vendeurs",
    "reclamations.empty": "Aucune réclamation pour l'instant.",
    "reclamations.report": "Signaler un vendeur",
    "reclamations.description": "Description du vendeur",
    "reclamations.whatTheySell": "Ce qu'il vend",
    "reclamations.city": "Ville",
    "reclamations.location": "Lieu",
    "reclamations.warning":
      "Décrivez le vendeur de manière anonyme — ne mentionnez pas son nom. Décrivez ses méthodes, son apparence, et l'arnaque pratiquée.",
    "reclamations.helpful": "Utile",
    "reclamations.descriptionPlaceholder":
      "Ex: Homme d'environ 40 ans près de Jemaa el-Fna, propose faussement de guider les touristes puis exige de l'argent...",
    "reclamations.submitSuccess": "Réclamation soumise avec succès.",
    "tips.filterCity": "Filtrer par ville",
    "tips.filterLocation": "Filtrer par lieu",
    "tips.all": "Tous",
    "tips.addTip": "Ajouter un conseil",
    "tips.titleLabel": "Titre",
    "tips.cityLabel": "Ville",
    "tips.locationLabel": "Lieu",
    "tips.contentLabel": "Conseil",
  },
  es: {
    "app.name": "No More Scam",
    "nav.feed": "Inicio",
    "nav.products": "Productos",
    "nav.tips": "Consejos",
    "nav.quiz": "Quiz",
    "nav.sites": "Sitios",
    "nav.badges": "Insignias",
    "nav.scams": "Estafas",
    "nav.arabic": "Aprender árabe",
    "nav.premium": "Get Premium",
    "profile.title": "Mi Perfil",
    "profile.identifiant": "Mi Identificación",
    "profile.username": "Nombre de usuario",
    "profile.country": "País",
    "profile.email": "Correo electrónico",
    "profile.language": "Idioma",
    "profile.account": "Información de la cuenta",
    "profile.stats": "Estadísticas y Progreso",
    "profile.badges": "Insignias obtenidas",
    "profile.points": "Puntos",
    "profile.quizScore": "Puntuación Quiz",
    "profile.tipsGiven": "Consejos dados",
    "profile.scamsReported": "Estafas reportadas",
    "profile.notLoggedIn": "Inicia sesión para ver tu perfil.",
    "btn.save": "Guardar",
    "btn.cancel": "Cancelar",
    "btn.edit": "Editar",
    "btn.delete": "Eliminar",
    "btn.connect": "Conexión",
    "btn.disconnect": "Desconexión",
    "lang.ar": "العربية",
    "lang.es": "Español",
    "lang.fr": "Français",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.empty": "No hay contenido disponible",
    "nav.reclamations": "Reclamaciones",
    "reclamations.title": "Reclamaciones de vendedores",
    "reclamations.empty": "No hay reclamaciones todavía.",
    "reclamations.report": "Denunciar un vendedor",
    "reclamations.description": "Descripción del vendedor",
    "reclamations.whatTheySell": "Lo que vende",
    "reclamations.city": "Ciudad",
    "reclamations.location": "Lugar",
    "reclamations.warning":
      "Describa al vendedor de forma anónima — no mencione su nombre. Describa sus métodos, apariencia y el tipo de estafa.",
    "reclamations.helpful": "Útil",
    "reclamations.descriptionPlaceholder":
      "Ej: Hombre de unos 40 años cerca de la plaza principal, ofrece ser guía y luego exige dinero...",
    "reclamations.submitSuccess": "Reclamación enviada con éxito.",
    "tips.filterCity": "Filtrar por ciudad",
    "tips.filterLocation": "Filtrar por lugar",
    "tips.all": "Todos",
    "tips.addTip": "Añadir consejo",
    "tips.titleLabel": "Título",
    "tips.cityLabel": "Ciudad",
    "tips.locationLabel": "Lugar",
    "tips.contentLabel": "Consejo",
  },
  ar: {
    "app.name": "لا مزيد من النصب",
    "nav.feed": "الرئيسية",
    "nav.products": "المنتجات",
    "nav.tips": "النصائح",
    "nav.quiz": "اختبار",
    "nav.sites": "المواقع",
    "nav.badges": "الشارات",
    "nav.scams": "عمليات النصب",
    "nav.arabic": "تعلم العربية",
    "nav.premium": "احصل على بريميوم",
    "profile.title": "ملفي الشخصي",
    "profile.identifiant": "هويتي",
    "profile.username": "اسم المستخدم",
    "profile.country": "البلد",
    "profile.email": "البريد الإلكتروني",
    "profile.language": "اللغة",
    "profile.account": "معلومات الحساب",
    "profile.stats": "الإحصائيات والتقدم",
    "profile.badges": "الشارات المكتسبة",
    "profile.points": "النقاط",
    "profile.quizScore": "نتيجة الاختبار",
    "profile.tipsGiven": "النصائح المقدمة",
    "profile.scamsReported": "عمليات النصب المبلغ عنها",
    "profile.notLoggedIn": "يرجى تسجيل الدخول لعرض ملفك الشخصي.",
    "btn.save": "حفظ",
    "btn.cancel": "إلغاء",
    "btn.edit": "تعديل",
    "btn.delete": "حذف",
    "btn.connect": "تسجيل الدخول",
    "btn.disconnect": "تسجيل الخروج",
    "lang.ar": "العربية",
    "lang.es": "Español",
    "lang.fr": "Français",
    "common.loading": "جارٍ التحميل...",
    "common.error": "حدث خطأ",
    "common.empty": "لا يوجد محتوى متاح",
    "nav.reclamations": "الشكاوى",
    "reclamations.title": "شكاوى البائعين",
    "reclamations.empty": "لا توجد شكاوى حتى الآن.",
    "reclamations.report": "الإبلاغ عن بائع",
    "reclamations.description": "وصف البائع",
    "reclamations.whatTheySell": "ما يبيعه",
    "reclamations.city": "المدينة",
    "reclamations.location": "المكان",
    "reclamations.warning":
      "صف البائع بشكل مجهول — لا تذكر اسمه. صف أساليبه ومظهره ونوع الاحتيال.",
    "reclamations.helpful": "مفيد",
    "reclamations.descriptionPlaceholder":
      "مثال: رجل في الأربعين من عمره بالقرب من الساحة الرئيسية، يعرض خدمات الدليل السياحي ثم يطلب المال...",
    "reclamations.submitSuccess": "تم تقديم الشكوى بنجاح.",
    "tips.filterCity": "تصفية حسب المدينة",
    "tips.filterLocation": "تصفية حسب المكان",
    "tips.all": "الكل",
    "tips.addTip": "إضافة نصيحة",
    "tips.titleLabel": "العنوان",
    "tips.cityLabel": "المدينة",
    "tips.locationLabel": "المكان",
    "tips.contentLabel": "النصيحة",
  },
};
