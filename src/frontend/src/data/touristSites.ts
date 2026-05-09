export interface TouristSite {
  id: string;
  name: string;
  city: string;
  icon: string;
  description: string;
  tips: string[];
  tags?: string[];
  mapUrl?: string;
}

export interface MoroccoRegion {
  id: string;
  name: string;
  capital: string;
  description: string;
  color: string;
  hoverColor: string;
  cities: string[];
  sites: TouristSite[];
}

// SVG polygon points for each region (viewBox 800x580)
export const regionPolygons: Record<string, string> = {
  MA01: "60,40 180,30 240,50 260,100 220,130 180,150 130,160 80,140 50,100 60,40",
  MA02: "240,50 380,20 420,40 440,80 400,120 360,140 280,150 260,100 240,50",
  MA03: "130,160 180,150 260,100 280,150 300,180 260,200 200,220 150,200 130,160",
  MA04: "50,100 80,140 130,160 150,200 120,230 80,240 40,220 30,170 50,100",
  MA05: "150,200 200,220 260,200 300,180 320,220 300,260 250,280 190,270 150,240 150,200",
  MA06: "40,220 80,240 120,230 150,240 190,270 170,300 120,320 70,310 40,270 40,220",
  MA07: "120,320 170,300 190,270 250,280 290,300 300,340 260,370 200,380 140,360 110,340 120,320",
  MA08: "300,180 360,140 400,120 440,80 470,100 500,160 520,240 490,310 440,350 380,370 320,360 290,300 300,260 320,220 300,180",
  MA09: "140,360 200,380 260,370 300,340 320,360 310,410 270,440 200,450 140,430 120,390 140,360",
  MA10: "120,390 140,430 200,450 270,440 310,410 320,460 290,500 230,510 150,500 110,460 120,390",
  MA11: "110,460 150,500 230,510 290,500 320,460 370,480 380,540 300,560 180,560 100,540 90,500 110,460",
  MA12: "180,560 300,560 380,540 400,570 380,580 200,580 180,560",
};

export const moroccoRegions: MoroccoRegion[] = [
  {
    id: "MA01",
    name: "Tanger-Tétouan-Al Hoceïma",
    capital: "Tanger",
    description:
      "Porte de l'Afrique et carrefour des cultures méditerranéenne, atlantique et rifaine. Région des contrastes entre mer, montagne et histoire millénaire.",
    color: "#bfdbfe",
    hoverColor: "#3b82f6",
    cities: ["Tanger", "Tétouan", "Al Hoceïma", "Chefchaouen", "Larache"],
    sites: [
      {
        id: "tanger-medina",
        name: "Médina de Tanger",
        city: "Tanger",
        icon: "🏛️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=M%C3%A9dina+de+Tanger+Tanger+Maroc",
        description:
          "Vieille ville historique aux ruelles labyrinthiques et au Palais du Mendoub. Carrefour entre l'Europe et l'Afrique, chargée de légendes et d'artistes célèbres.",
        tips: [
          "Visitez le Palais du Sultan (musée Forbes) pour ses collections historiques.",
          "Évitez les rabatteurs proposant des 'visites gratuites' — engagez uniquement un guide officiel ONMT.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "grottes-hercule",
        name: "Grottes d'Hercule",
        city: "Tanger",
        icon: "🦁",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Grottes+d%27Hercule+Tanger+Maroc",
        description:
          "Grottes marines spectaculaires surplombant l'Atlantique, selon la légende creusées par Hercule avant ses travaux. L'ouverture en forme d'Afrique inversée est iconique.",
        tips: [
          "Accessible en taxi depuis Tanger — négociez le prix à l'avance (80-120 MAD).",
          "Venez en dehors des heures de pointe pour profiter du site sereinement.",
        ],
        tags: ["nature", "patrimoine"],
      },
      {
        id: "cap-spartel",
        name: "Cap Spartel",
        city: "Tanger",
        icon: "🌊",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Cap+Spartel+Tanger+Maroc",
        description:
          "Phare emblématique marquant la jonction entre l'Atlantique et la Méditerranée, à la pointe nord-ouest de l'Afrique. Panorama exceptionnel sur deux mers.",
        tips: [
          "Venez au coucher du soleil pour voir les deux océans se rencontrer.",
          "Les grottes d'Hercule sont à 500 m — combinez les deux en une sortie.",
        ],
        tags: ["nature", "paysage"],
      },
      {
        id: "tetouan-medina",
        name: "Médina de Tétouan",
        city: "Tétouan",
        icon: "🕌",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=M%C3%A9dina+de+T%C3%A9touan+T%C3%A9touan+Maroc",
        description:
          "Patrimoine mondial UNESCO, architecture hispano-mauresque unique héritée des Andalous expulsés d'Espagne au XVe siècle. L'une des médinas les mieux préservées du Maroc.",
        tips: [
          "Engagez un guide officiel ONMT pour comprendre l'histoire andalouse unique.",
          "La médina est moins touristique que Fès — les prix sont plus raisonnables.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "plage-al-hoceima",
        name: "Plage d'Al Hoceïma",
        city: "Al Hoceïma",
        icon: "🏖️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Plage+Al+Hoce%C3%AFma+Maroc",
        description:
          "Parc national et plages cristallines du Rif méditerranéen. Eaux turquoises exceptionnellement claires dans un cadre naturel préservé, loin du tourisme de masse.",
        tips: [
          "Meilleure période : juin à septembre pour des eaux calmes et chaudes.",
          "Évitez les vendeurs ambulants en haute saison — leurs prix sont excessifs.",
        ],
        tags: ["plage", "nature"],
      },
      {
        id: "chefchaouen",
        name: "Chefchaouen",
        city: "Chefchaouen",
        icon: "💙",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Chefchaouen+Maroc",
        description:
          "La célèbre ville bleue nichée dans les montagnes du Rif. Ruelles peintes en bleu et blanc, souks artisanaux et atmosphère mystique unique au monde.",
        tips: [
          "Meilleure lumière pour les photos en fin d'après-midi.",
          "Portez des chaussures confortables pour les ruelles en pente.",
        ],
        tags: ["patrimoine", "paysage"],
      },
    ],
  },
  {
    id: "MA02",
    name: "L'Oriental",
    capital: "Oujda",
    description:
      "Région aux paysages variés, entre montagnes du Rif, steppes et oasis sahariennes, à la frontière algérienne. Riche d'une culture et d'une gastronomie distinctives.",
    color: "#d1fae5",
    hoverColor: "#10b981",
    cities: [
      "Oujda",
      "Nador",
      "Berkane",
      "Taourirt",
      "Jerada",
      "Saïdia",
      "Figuig",
    ],
    sites: [
      {
        id: "oujda-medina",
        name: "Oujda",
        city: "Oujda",
        icon: "🕌",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=M%C3%A9dina+Oujda+Maroc",
        description:
          "Médina animée, mosquée El-Jama et place du 16 Août. Capitale de l'Oriental avec ses souks traditionnels et sa porte emblématique Bab El Wahab.",
        tips: [
          "Le souk aux poissons est remarquable — vivez l'expérience le matin.",
          "La ville est moins touristique — les prix sont plus honnêtes qu'ailleurs.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "figuig-palmeraie",
        name: "Figuig",
        city: "Figuig",
        icon: "🌴",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Figuig+palmeraie+Maroc",
        description:
          "Oasis saharienne aux palmeraies millénaires, aux confins du désert. Plus de 200 000 palmiers-dattiers dans l'une des oasis les plus isolées et préservées du Maroc.",
        tips: [
          "Vérifiez les conditions d'accès à la frontière avant de partir.",
          "Visitez en automne pour la récolte des dattes — spectacle unique.",
        ],
        tags: ["désert", "nature"],
      },
      {
        id: "lac-sidi-mohamed",
        name: "Lac de Sidi Mohamed Ben Ali",
        city: "Oujda",
        icon: "🏞️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Lac+Sidi+Mohamed+Ben+Ali+Oujda+Maroc",
        description:
          "Beau lac artificiel aux abords d'Oujda, lieu de promenade prisé des habitants. Idéal pour une pause nature en bordure de la ville.",
        tips: [
          "Idéal pour les pique-niques et les balades familiales à l'écart de la ville.",
          "Accessible en transport local depuis le centre d'Oujda.",
        ],
        tags: ["nature"],
      },
      {
        id: "grottes-taforalt",
        name: "Berkane & Grottes de Taforalt",
        city: "Berkane",
        icon: "🦴",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Grottes+de+Taforalt+Berkane+Maroc",
        description:
          "Site préhistorique parmi les plus anciens du Maroc. Les grottes de Taforalt ont livré des ossements humains vieux de 12 000 ans, témoignant d'une présence humaine exceptionnelle.",
        tips: [
          "Visitez la Grotte du Chameau pour ses stalactites remarquables.",
          "Les orangers de Berkane donnent une clémentine AOC réputée — goûtez-la en saison.",
        ],
        tags: ["patrimoine", "nature"],
      },
      {
        id: "saidia-plage",
        name: "Saïdia",
        city: "Saïdia",
        icon: "🏖️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Sa%C3%AFdia+plage+Maroc",
        description:
          "Station balnéaire méditerranéenne surnommée la Perle Bleue. Longue plage de sable fin s'étendant sur 14 km avec des eaux cristallines.",
        tips: [
          "Meilleure période : juillet-août, mais aussi moins cher en juin.",
          "Évitez les vendeurs ambulants sur la plage — leurs prix sont excessifs.",
        ],
        tags: ["plage"],
      },
      {
        id: "beni-snassen",
        name: "Monts des Beni Snassen",
        city: "Berkane",
        icon: "⛰️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Monts+Beni+Snassen+Berkane+Maroc",
        description:
          "Massif calcaire avec gorges spectaculaires et cascades dans les montagnes des Béni-Snassen, entre vignobles et vergers d'orangers.",
        tips: [
          "Randonnée possible — prévoir eau et chaussures de trek.",
          "La route des gorges du Zegzel est parmi les plus belles de la région.",
        ],
        tags: ["nature"],
      },
    ],
  },
  {
    id: "MA03",
    name: "Fès-Meknès",
    capital: "Fès",
    description:
      "Berceau de la civilisation arabo-islamique au Maroc, abritant la plus vieille université du monde (Al Quaraouiyine, 859 ap. J.-C.) et deux villes impériales.",
    color: "#fde68a",
    hoverColor: "#f59e0b",
    cities: ["Fès", "Meknès", "Ifrane", "Taza", "Sefrou", "Azrou"],
    sites: [
      {
        id: "fes-medina",
        name: "Médina de Fès (Fès el-Bali)",
        city: "Fès",
        icon: "🏛️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=M%C3%A9dina+de+F%C3%A8s+F%C3%A8s+el-Bali+Maroc",
        description:
          "Plus grande médina piétonne du monde, Patrimoine mondial UNESCO. Ses 9 000 ruelles, madrasas, fondouks et tanneries forment un labyrinthe médiéval vivant inchangé depuis des siècles.",
        tips: [
          "Engagez uniquement un guide officiel ONMT — les faux guides sont très nombreux à Fès.",
          "Commencez la visite tôt le matin avant la foule touristique.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "tanneries-chouara",
        name: "Tanneries Chouara",
        city: "Fès",
        icon: "🎨",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Tanneries+Chouara+F%C3%A8s+Maroc",
        description:
          "Teintureries traditionnelles du XIe siècle, spectacle unique au monde. Le travail du cuir y est encore fait à la main selon des méthodes médiévales inchangées.",
        tips: [
          "Observation gratuite depuis les terrasses des boutiques de cuir.",
          "Acceptez le brin de menthe offert — il atténue les odeurs fortes.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "volubilis",
        name: "Volubilis",
        city: "Meknès",
        icon: "🏺",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Volubilis+Mekn%C3%A8s+Maroc",
        description:
          "Ruines romaines exceptionnelles classées à l'UNESCO. Mosaïques remarquablement préservées datant du IIe-IIIe siècle, arc de triomphe et forum impressionnants.",
        tips: [
          "Visitez en fin de journée — la lumière dorée sublime les ruines.",
          "Refusez les 'guides' non accrédités à l'entrée — seuls les guides ONMT sont fiables.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "meknes",
        name: "Meknès",
        city: "Meknès",
        icon: "🏰",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Mekn%C3%A8s+ville+imp%C3%A9riale+Maroc",
        description:
          "Ville impériale avec la grandiose porte Bab Mansour, les greniers royaux Heri es-Souani et le Mausolée de Moulay Ismail accessible aux non-musulmans.",
        tips: [
          "Moins touristique que Fès — les prix des souvenirs sont plus raisonnables.",
          "Le mausolée Moulay Ismail est ouvert aux non-musulmans — tenue correcte exigée.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "ifrane",
        name: "Ifrane",
        city: "Ifrane",
        icon: "🏔️",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=Ifrane+Maroc",
        description:
          "La Suisse du Maroc, ville alpine aux chalets d'inspiration européenne et cèdres de l'Atlas. Station de ski en hiver, air pur et fraîcheur en été.",
        tips: [
          "Température fraîche même en été — prévoyez toujours une veste.",
          "La forêt de Cèdres d'Azrou est à 17 km — singes macaques sauvages à admirer.",
        ],
        tags: ["nature", "paysage"],
      },
      {
        id: "azrou-cedres",
        name: "Azrou & Cèdres de Gouraud",
        city: "Azrou",
        icon: "🌲",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Azrou+C%C3%A8dres+de+Gouraud+Maroc",
        description:
          "Forêt de cèdres millénaires et singes de Barbarie (macaques) sauvages dans un décor alpin unique. Le Cèdre Gouraud, vieux de 800 ans, est le plus grand du Maroc.",
        tips: [
          "Ne nourrissez pas les singes — cela perturbe leur comportement naturel.",
          "Randonnée possible toute l'année — chaussures de trek conseillées.",
        ],
        tags: ["nature"],
      },
    ],
  },
  {
    id: "MA04",
    name: "Rabat-Salé-Kénitra",
    capital: "Rabat",
    description:
      "Capitale administrative et politique du Maroc, avec un riche patrimoine royal, colonial et médiéval. Inscrite au Patrimoine mondial de l'UNESCO en 2012.",
    color: "#fecaca",
    hoverColor: "#ef4444",
    cities: ["Rabat", "Salé", "Kénitra", "Khémisset", "Tiflet", "Skhirat"],
    sites: [
      {
        id: "tour-hassan",
        name: "Tour Hassan & Mausolée Mohammed V",
        city: "Rabat",
        icon: "🕌",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Tour+Hassan+Mausol%C3%A9e+Mohammed+V+Rabat+Maroc",
        description:
          "Emblème de Rabat, le minaret inachevé de la Tour Hassan (XIIe siècle) face au royal Mausolée Mohammed V, chef-d'œuvre de l'art funéraire marocain moderne.",
        tips: [
          "Le mausolée est ouvert aux non-musulmans — tenue correcte et respect exigés.",
          "Entrée gratuite — aucun 'guide' à payer pour accéder au site.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "kasbah-oudayas",
        name: "Kasbah des Oudaias",
        city: "Rabat",
        icon: "🏰",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Kasbah+des+Oudaias+Rabat+Maroc",
        description:
          "Forteresse almohade classée UNESCO avec jardins andalous. Ruelles bleu et blanc dominant l'embouchure du Bou Regreg — l'un des endroits les plus photogéniques du Maroc.",
        tips: [
          "Entrée gratuite dans la kasbah — le musée intérieur est payant.",
          "Le café Maure dans les jardins offre une vue exceptionnelle sur l'Atlantique.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "chellah",
        name: "Chellah",
        city: "Rabat",
        icon: "🌿",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Chellah+Rabat+Maroc",
        description:
          "Nécropole mérinide aux vestiges romains et jardins romantiques envahis par la végétation. Habitée par des cigognes blanches dans un cadre paisible et mystérieux.",
        tips: [
          "Visitez entre mars et mai pour voir les cigognes avec leurs petits.",
          "Entrée payante mais modeste — le site est bien moins fréquenté que la Tour Hassan.",
        ],
        tags: ["patrimoine", "nature"],
      },
      {
        id: "sale-medina",
        name: "Médina de Salé",
        city: "Salé",
        icon: "🏛️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=M%C3%A9dina+de+Sal%C3%A9+Maroc",
        description:
          "Vieille ville fortifiée au charme authentique préservé. Traversez le Bou Regreg en barque depuis Rabat pour découvrir une cité médiévale moins touristique.",
        tips: [
          "Accessible en barque depuis Rabat pour une expérience unique (5-10 MAD).",
          "Le souk de Salé est moins cher que celui de Rabat ou de Fès.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "foret-mamora",
        name: "Forêt de Mamora",
        city: "Kénitra",
        icon: "🌳",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=For%C3%AAt+de+Mamora+K%C3%A9nitra+Maroc",
        description:
          "La plus grande forêt de chêne-liège du monde (134 000 ha), entre Atlantique et plaine du Gharb. Un poumon vert exceptionnel prisé pour les balades et pique-niques.",
        tips: [
          "Évitez de cueillir ou de ramasser quoi que ce soit — forêt protégée.",
          "Accessible en transport depuis Rabat ou Kénitra.",
        ],
        tags: ["nature"],
      },
      {
        id: "plage-skhirat",
        name: "Plage de Skhirat",
        city: "Skhirat",
        icon: "🏖️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Plage+de+Skhirat+Maroc",
        description:
          "Belles plages atlantiques prisées des Rbatis et Casablancais. Cadre verdoyant alliant mer et pinède, à mi-chemin entre Rabat et Casablanca.",
        tips: [
          "Meilleure période : juin à septembre pour une eau suffisamment chaude.",
          "Les restaurants de poisson en bord de mer offrent un bon rapport qualité-prix.",
        ],
        tags: ["plage"],
      },
    ],
  },
  {
    id: "MA05",
    name: "Béni Mellal-Khénifra",
    capital: "Béni Mellal",
    description:
      "Région du Moyen Atlas et des contreforts du Haut Atlas, carrefour entre plaines fertiles et montagnes berbères. Cascades, lacs et gorges d'une beauté sauvage.",
    color: "#d1d5db",
    hoverColor: "#6b7280",
    cities: ["Béni Mellal", "Khénifra", "Azilal", "Fquih Ben Salah"],
    sites: [
      {
        id: "cascades-ouzoud",
        name: "Cascades d'Ouzoud",
        city: "Azilal",
        icon: "💧",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Cascades+d%27Ouzoud+Azilal+Maroc",
        description:
          "Plus hautes chutes d'eau du Maroc (110 m), entourées d'oliviers millénaires et peuplées de singes magots. Arcs-en-ciel constants dans les embruns — un spectacle magique.",
        tips: [
          "Visitez le matin pour voir les arcs-en-ciel dans les embruns.",
          "Méfiez-vous des guides non officiels à l'entrée — engagez un guide certifié.",
        ],
        tags: ["nature", "paysage"],
      },
      {
        id: "lac-bin-el-ouidane",
        name: "Lac Bin El Ouidane",
        city: "Azilal",
        icon: "🏞️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Lac+Bin+El+Ouidane+Azilal+Maroc",
        description:
          "Grand lac artificiel entouré de montagnes spectaculaires, idéal pour les sports nautiques et les bivouacs. Le plus grand barrage du Maroc dans un écrin naturel exceptionnel.",
        tips: [
          "Les activités nautiques se louent directement au bord du lac.",
          "La route est sinueuse — conduisez avec prudence, surtout la nuit.",
        ],
        tags: ["nature", "plage"],
      },
      {
        id: "khenifra-moyen-atlas",
        name: "Khénifra & Moyen Atlas",
        city: "Khénifra",
        icon: "⛰️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Kh%C3%A9nifra+Moyen+Atlas+Maroc",
        description:
          "Paysages berbères authentiques et sources de l'Oum Er-Rbia, le fleuve le plus long du Maroc. Forêts de cèdres, lacs de montagne et culture amazighe vivante.",
        tips: [
          "Embauchez un guide local agréé pour les randonnées en montagne.",
          "Prévoyez des vêtements chauds même en été — les nuits sont froides en altitude.",
        ],
        tags: ["nature", "patrimoine"],
      },
      {
        id: "kasbah-beni-mellal",
        name: "Kasbah de Béni Mellal",
        city: "Béni Mellal",
        icon: "🏰",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Kasbah+B%C3%A9ni+Mellal+Maroc",
        description:
          "Forteresse du XVIIe siècle dominant la ville aux jardins de Aïn Asserdoun avec ses sources naturelles. Vue panoramique sur la plaine du Tadla.",
        tips: [
          "Entrée libre — idéal pour une promenade en fin de journée.",
          "Les jardins de Aïn Asserdoun attenants sont rafraîchissants en été.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "gorges-oum-er-rbia",
        name: "Gorges de l'Oum Er-Rbia",
        city: "Khénifra",
        icon: "🌊",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Gorges+Oum+Er-Rbia+Kh%C3%A9nifra+Maroc",
        description:
          "Canyon spectaculaire aux sources bleues multiples jaillissant de la roche. Des dizaines de sources se rejoignent pour former le fleuve Oum Er-Rbia dans un cadre grandiose.",
        tips: [
          "Visitez au printemps pour un débit maximum et une végétation luxuriante.",
          "Les sources sont accessibles à pied depuis le parking — sentier facile.",
        ],
        tags: ["nature", "paysage"],
      },
    ],
  },
  {
    id: "MA06",
    name: "Casablanca-Settat",
    capital: "Casablanca",
    description:
      "Métropole économique et capitale financière du Maroc. Architecture Art Déco unique, cosmopolitisme, la majestueuse Mosquée Hassan II et des plages atlantiques animées.",
    color: "#e9d5ff",
    hoverColor: "#a855f7",
    cities: ["Casablanca", "Settat", "El Jadida", "Mohammedia", "Berrechid"],
    sites: [
      {
        id: "mosquee-hassan-2",
        name: "Mosquée Hassan II",
        city: "Casablanca",
        icon: "🕌",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Mosqu%C3%A9e+Hassan+II+Casablanca+Maroc",
        description:
          "3e plus grande mosquée du monde, minaret de 210 m sur l'Atlantique. Partiellement construite sur l'océan, sa salle de prière peut accueillir 25 000 fidèles.",
        tips: [
          "Visites guidées pour non-musulmans (60-120 MAD) — réservez en ligne.",
          "La visite nocturne illuminée est particulièrement impressionnante.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "corniche-casablanca",
        name: "Corniche de Casablanca",
        city: "Casablanca",
        icon: "🌊",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Corniche+Casablanca+A%C3%AFn+Diab+Maroc",
        description:
          "Boulevard balnéaire animé, restaurants et piscines naturelles face à l'Atlantique. La corniche Aïn Diab est le cœur de la vie nocturne et estivale casablancaise.",
        tips: [
          "Comparez les prix des restaurants — certains pratiquent des tarifs excessifs pour touristes.",
          "La balade à pied le long du littoral est gratuite et très agréable.",
        ],
        tags: ["plage", "paysage"],
      },
      {
        id: "medina-casablanca",
        name: "Médina de Casablanca",
        city: "Casablanca",
        icon: "🏛️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=M%C3%A9dina+Casablanca+Art+D%C3%A9co+Maroc",
        description:
          "Quartier historique avec la place Mohammed V et son architecture Art Déco unique au monde. L'héritage urbain du Protectorat français, avec des immeubles des années 1930-1950.",
        tips: [
          "L'Office du tourisme propose des visites guidées du patrimoine Art Déco.",
          "Le boulevard Mohammed V concentre les plus beaux bâtiments — promenade gratuite.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "el-jadida-azemmour",
        name: "El Jadida & Azemmour",
        city: "El Jadida",
        icon: "🏰",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=El+Jadida+citerne+portugaise+Maroc",
        description:
          "Cité portugaise d'Azemmour et citerne portugaise classée UNESCO. La citerne souterraine aux reflets aquatiques magiques rendue célèbre par le film d'Orson Welles.",
        tips: [
          "La citerne portugaise est le clou de la visite — ne la ratez pas.",
          "Ville côtière moins touristique que Casablanca — les prix sont plus honnêtes.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "kasbah-boulaouane",
        name: "Kasbah de Boulaouane",
        city: "Settat",
        icon: "🍇",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Kasbah+Boulaouane+Settat+Maroc",
        description:
          "Forteresse alaouite du XVIIIe siècle au cœur des vignobles, construite par le Sultan Moulay Ismail. Vue panoramique sur l'Oued Oum Er-Rbia et les terres agricoles.",
        tips: [
          "Site peu fréquenté — idéal pour une visite calme et authentique.",
          "La route depuis Casablanca traverse des paysages agricoles magnifiques.",
        ],
        tags: ["patrimoine", "nature"],
      },
    ],
  },
  {
    id: "MA07",
    name: "Marrakech-Safi",
    capital: "Marrakech",
    description:
      "Ville impériale et capitale touristique du Maroc. La mythique place Jemaa el-Fna, les souks incontournables, et des accès vers l'Atlas et l'Atlantique.",
    color: "#fed7aa",
    hoverColor: "#f97316",
    cities: ["Marrakech", "Essaouira", "Safi", "El Kelâa des Sraghna", "Asni"],
    sites: [
      {
        id: "jemaa-el-fna",
        name: "Place Jemaa el-Fna",
        city: "Marrakech",
        icon: "🎭",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Place+Jemaa+el-Fna+Marrakech+Maroc",
        description:
          "Place mythique animée, conteurs, musiciens et cuisine de rue. Classée au patrimoine immatériel de l'UNESCO, elle se transforme chaque soir en un spectacle unique au monde.",
        tips: [
          "Ne posez pas pour des photos avec les serpents ou singes sans fixer le prix à l'avance.",
          "Les stands de nourriture : vérifiez les prix AVANT de vous asseoir — certains escroquent.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "jardin-majorelle",
        name: "Jardin Majorelle",
        city: "Marrakech",
        icon: "🌺",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Jardin+Majorelle+Marrakech+Maroc",
        description:
          "Oasis botanique aux azurs intenses, ancienne propriété d'Yves Saint Laurent. Le bleu cobalt 'bleu majorelle' est devenu une couleur iconique dans le monde du design.",
        tips: [
          "Réservez en ligne — les queues peuvent être très longues en haute saison.",
          "Visitez tôt le matin pour éviter la foule et profiter de la fraîcheur.",
        ],
        tags: ["nature", "paysage"],
      },
      {
        id: "palais-bahia",
        name: "Palais de la Bahia",
        city: "Marrakech",
        icon: "🏰",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Palais+de+la+Bahia+Marrakech+Maroc",
        description:
          "Chef-d'œuvre de l'architecture mauresque du XIXe siècle. Ses patios ornementés, jardins d'orangers et plafonds en bois peint illustrent le raffinement de l'art marocain.",
        tips: [
          "Venez tôt le matin pour de meilleures photos sans la foule.",
          "Un guide officiel enrichira considérablement la visite.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "ourika-oukaimeden",
        name: "Ourika & Oukaïmeden",
        city: "Marrakech",
        icon: "🏔️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Vall%C3%A9e+de+l%27Ourika+Marrakech+Maroc",
        description:
          "Vallée verdoyante et station de ski dans le Haut Atlas, à 1h de Marrakech. Randonnées, cascades, villages berbères et en hiver des pistes de ski uniques en Afrique.",
        tips: [
          "La vallée de l'Ourika est magnifique au printemps — torrents et verdure.",
          "Négociez le prix des excursions directement avec les coopératives locales.",
        ],
        tags: ["nature", "paysage"],
      },
      {
        id: "essaouira",
        name: "Essaouira",
        city: "Essaouira",
        icon: "🌊",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Essaouira+m%C3%A9dina+Maroc",
        description:
          "Cité des vents, médina bleue et blanche au bord de l'Atlantique classée UNESCO. Port de pêche animé, artisans de thuya, festival Gnaoua mondialement connu.",
        tips: [
          "Le vent (alizés) est fort — prévoyez une veste même en été.",
          "Le festival Gnaoua (juin) est une expérience musicale unique — réservez tôt.",
        ],
        tags: ["patrimoine", "plage", "medina"],
      },
      {
        id: "toubkal",
        name: "Toubkal",
        city: "Asni",
        icon: "⛰️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Jbel+Toubkal+Asni+Maroc",
        description:
          "Plus haut sommet d'Afrique du Nord (4 167 m), randonnées exceptionnelles. L'ascension dure 2 jours depuis Imlil et ne nécessite pas de matériel technique en été.",
        tips: [
          "Engagez obligatoirement un guide agréé pour l'ascension — obligatoire légalement.",
          "Prévoyez des vêtements chauds — température sous zéro au sommet même en juillet.",
        ],
        tags: ["nature", "paysage"],
      },
    ],
  },
  {
    id: "MA08",
    name: "Drâa-Tafilalet",
    capital: "Errachidia",
    description:
      "Vaste région désertique abritant les dunes dorées du Sahara, les ksour fortifiés et une richesse culturelle et cinématographique unique. La porte du désert marocain.",
    color: "#fef08a",
    hoverColor: "#eab308",
    cities: ["Errachidia", "Ouarzazate", "Zagora", "Tinghir", "Midelt"],
    sites: [
      {
        id: "erg-chebbi",
        name: "Merzouga & Erg Chebbi",
        city: "Errachidia",
        icon: "🐪",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Merzouga+Erg+Chebbi+Maroc",
        description:
          "Dunes géantes dorées pouvant atteindre 150 m, balade en dromadaire au lever du soleil. Les dunes d'Erg Chebbi s'étendent sur 22 km dans un décor saharien grandiose.",
        tips: [
          "Réservez un camp de bivouac à l'avance en haute saison.",
          "Négociez le prix de la randonnée chameau avant le départ — comparez plusieurs offres.",
        ],
        tags: ["désert", "paysage"],
      },
      {
        id: "gorges-dades",
        name: "Gorges du Dadès",
        city: "Tinghir",
        icon: "🏜️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Gorges+du+Dad%C3%A8s+Tinghir+Maroc",
        description:
          "Canyon aux falaises rouges et kasbahs troglodytes sur la route des Mille Kasbahs. La 'route des mille virages' est l'une des plus photographiées du Maroc.",
        tips: [
          "Le village de Aït Oudinar offre un point de vue panoramique exceptionnel.",
          "En voiture : route praticable mais sinueuse — conduisez prudemment.",
        ],
        tags: ["nature", "patrimoine"],
      },
      {
        id: "gorges-todra",
        name: "Gorges du Todra",
        city: "Tinghir",
        icon: "🧗",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Gorges+du+Todra+Tinghir+Maroc",
        description:
          "Failles spectaculaires de 300 m de haut pour 10 m de large, paradis des alpinistes. Le canyon est traversé par une rivière et offre une quiétude absolue.",
        tips: [
          "Dormez dans les gorges pour profiter de la quiétude nocturne.",
          "Les grimpeurs peuvent trouver des guides locaux certifiés sur place.",
        ],
        tags: ["nature", "paysage"],
      },
      {
        id: "vallee-draa",
        name: "Vallée du Drâa",
        city: "Zagora",
        icon: "🌴",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Vall%C3%A9e+du+Dr%C3%A2a+Zagora+Maroc",
        description:
          "Plus longue palmeraie du Maroc (200 km), jalonnée de kasbahs et d'oasis. La route de Zagora à M'hamid traverse des paysages désertiques d'une beauté rare.",
        tips: [
          "Louez un vélo à Zagora pour explorer les villages berbères à votre rythme.",
          "Évitez les intermédiaires pour les excursions — contactez directement les riads.",
        ],
        tags: ["désert", "patrimoine"],
      },
      {
        id: "zagora",
        name: "Zagora",
        city: "Zagora",
        icon: "🐫",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Zagora+porte+du+d%C3%A9sert+Maroc",
        description:
          "Porte du désert, dunes de l'Erg Chegaga et caravanes sahariennes. La légendaire pancarte 'Tombouctou 52 jours' symbolise l'esprit aventurier de cette ville.",
        tips: [
          "La route de Zagora à M'hamid El Ghizlane est l'une des plus belles du Maroc.",
          "Négociez l'excursion chameau directement avec les habitants locaux.",
        ],
        tags: ["désert"],
      },
      {
        id: "ait-benhaddou",
        name: "Aït Ben Haddou",
        city: "Ouarzazate",
        icon: "🎬",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=A%C3%AFt+Ben+Haddou+Ouarzazate+Maroc",
        description:
          "Ksar fortifié UNESCO, décor de cinéma légendaire (Gladiator, Game of Thrones, Lawrence d'Arabie). Ce village de terre séchée est l'une des architectures les plus photographiées d'Afrique.",
        tips: [
          "Engagez un guide local officiel pour la visite — les explications sont fascinantes.",
          "La meilleure lumière est au lever ou au coucher du soleil.",
        ],
        tags: ["patrimoine"],
      },
    ],
  },
  {
    id: "MA09",
    name: "Souss-Massa",
    capital: "Agadir",
    description:
      "Région ensoleillée du Sud marocain avec Agadir comme capitale balnéaire, les Anti-Atlas berbères, les arganiers et des réserves naturelles exceptionnelles.",
    color: "#bbf7d0",
    hoverColor: "#22c55e",
    cities: ["Agadir", "Tiznit", "Taroudant", "Inezgane", "Asni"],
    sites: [
      {
        id: "agadir-plage",
        name: "Plage d'Agadir",
        city: "Agadir",
        icon: "🏖️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Plage+Agadir+Maroc",
        description:
          "10 km de sable fin doré, station balnéaire internationale avec 300 jours de soleil par an. Reconstruite après le séisme de 1960, Agadir est la capitale balnéaire du Maroc.",
        tips: [
          "Évitez les vendeurs ambulants — certains sont agressifs en haute saison.",
          "L'eau atlantique est fraîche — courant froid des Canaries, même en été.",
        ],
        tags: ["plage"],
      },
      {
        id: "parc-souss-massa",
        name: "Parc national Souss-Massa",
        city: "Agadir",
        icon: "🦩",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Parc+national+Souss-Massa+Agadir+Maroc",
        description:
          "Réserve naturelle abritant l'ibis chauve (oiseau menacé), les flamants roses et de nombreuses espèces d'oiseaux migrateurs face à l'Atlantique.",
        tips: [
          "Visitez à l'aube pour voir les oiseaux actifs — apportez des jumelles.",
          "Entrée gratuite — respectez strictement les règles du parc.",
        ],
        tags: ["nature"],
      },
      {
        id: "taroudant",
        name: "Taroudant",
        city: "Taroudant",
        icon: "🏰",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Taroudant+remparts+Maroc",
        description:
          "Petite Marrakech aux remparts ocre et souks authentiques. Ville fortifiée moins touristique avec ses remparts parfaitement préservés et ses artisans accessibles.",
        tips: [
          "Les remparts se parcourent en calèche (prix à négocier avant de monter).",
          "Moins touristique que Marrakech — les artisans sont plus accessibles et les prix honnêtes.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "tiznit",
        name: "Tiznit",
        city: "Tiznit",
        icon: "💎",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Tiznit+bijouterie+Maroc",
        description:
          "Cité des bijoutiers berbères, médina et murs de pisé. Capitale de la bijouterie berbère en argent, avec des artisans orfèvres perpétuant des techniques ancestrales.",
        tips: [
          "Achetez directement chez les artisans dans la médina pour les meilleurs prix.",
          "Vérifiez le poinçon d'argent avant tout achat — garantit l'authenticité.",
        ],
        tags: ["patrimoine", "medina"],
      },
      {
        id: "imouzzer",
        name: "Imouzzer des Ida Outanane",
        city: "Agadir",
        icon: "💧",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Imouzzer+des+Ida+Outanane+Agadir+Maroc",
        description:
          "Cascade et palmeraie dans un écrin de montagne, à 60 km d'Agadir. Piscines naturelles, villages berbères et arganiers dans un paysage verdoyant unique.",
        tips: [
          "Meilleure période : printemps (mars-avril) pour la cascade en plein débit.",
          "Déjeuner berbère chez l'habitant pour une expérience authentique.",
        ],
        tags: ["nature", "paysage"],
      },
      {
        id: "kasbah-oufella",
        name: "Kasbah d'Agadir Oufella",
        city: "Agadir",
        icon: "🌅",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Kasbah+Agadir+Oufella+Maroc",
        description:
          "Ruines de la citadelle surplombant la baie d'Agadir, coucher de soleil exceptionnel. La kasbah reconstruite après le séisme offre une vue panoramique sur toute la baie.",
        tips: [
          "Meilleur moment : 1h avant le coucher du soleil pour la lumière dorée.",
          "Accessible en taxi ou à pied depuis le centre — entrée libre.",
        ],
        tags: ["patrimoine", "paysage"],
      },
    ],
  },
  {
    id: "MA10",
    name: "Guelmim-Oued Noun",
    capital: "Guelmim",
    description:
      "Porte du Sahara et du Grand Sud marocain. Carrefour historique des caravanes transsahariennes, avec ses moussems, ses dunes et ses paysages atlantiques sauvages.",
    color: "#fca5a5",
    hoverColor: "#dc2626",
    cities: ["Guelmim", "Tan-Tan", "Sidi Ifni", "Assa"],
    sites: [
      {
        id: "guelmim-porte-sahara",
        name: "Guelmim (Porte du Sahara)",
        city: "Guelmim",
        icon: "🐪",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Guelmim+march%C3%A9+chameaux+Maroc",
        description:
          "Marché aux chameaux du samedi, carrefour historique des caravanes transsahariennes. Le plus grand marché aux chameaux du Maroc attire éleveurs nomades et marchands sahraouis.",
        tips: [
          "Le souk commence à l'aube — arrivez très tôt pour vivre l'atmosphère authentique.",
          "Photographiez uniquement avec l'accord des personnes — respectez les traditions.",
        ],
        tags: ["désert"],
      },
      {
        id: "plage-tan-tan",
        name: "Plage de Tan-Tan",
        city: "Tan-Tan",
        icon: "🏖️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Plage+Tan-Tan+Maroc",
        description:
          "Falaises atlantiques sauvages et plage vierge préservée. À 25 km de Tan-Tan, cette plage peu connue offre une solitude absolue face à un Atlantique puissant.",
        tips: [
          "Les courants atlantiques sont forts — attention à la baignade.",
          "Achetez du poisson frais directement aux pêcheurs à prix équitable.",
        ],
        tags: ["paysage", "plage"],
      },
      {
        id: "erg-chegaga",
        name: "Erg Chegaga",
        city: "Guelmim",
        icon: "🏜️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Erg+Chegaga+Guelmim+Maroc",
        description:
          "Dunes parmi les plus grandes et les plus isolées du Sahara marocain. Cet erg sauvage, loin des circuits touristiques de masse, offre une expérience désertique authentique.",
        tips: [
          "Accessible uniquement en 4x4 ou dromadaire — prévoyez au minimum 2 jours.",
          "Emportez eau, nourriture et protection solaire en quantité suffisante.",
        ],
        tags: ["nature"],
      },
      {
        id: "oasis-tighmert",
        name: "Oasis de Tighmert",
        city: "Guelmim",
        icon: "🌴",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Oasis+Tighmert+Guelmim+Maroc",
        description:
          "Palmeraie préservée aux sources naturelles, peu connue des touristes. Villages en pisé et atmosphère de paix au milieu des hamadas, refuge de la culture sahraouie.",
        tips: [
          "Hébergement chez l'habitant possible — vérifiez l'accueil à l'avance.",
          "Apportez des vivres — la région est peu équipée en commerces.",
        ],
        tags: ["nature", "désert"],
      },
      {
        id: "sidi-ifni",
        name: "Sidi Ifni",
        city: "Sidi Ifni",
        icon: "🏛️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Sidi+Ifni+Art+D%C3%A9co+Maroc",
        description:
          "Ancienne ville espagnole Art Déco face à l'Atlantique, retrocédée au Maroc en 1969. Architecture coloniale unique en plein Maroc, avec des falaises dramatiques et une plage sauvage.",
        tips: [
          "La ville est surprenante — architecture espagnole Art Déco unique au Maroc.",
          "La route côtière depuis Tiznit est spectaculaire — une des plus belles du Maroc.",
        ],
        tags: ["patrimoine", "plage"],
      },
    ],
  },
  {
    id: "MA11",
    name: "Laâyoune-Sakia El Hamra",
    capital: "Laâyoune",
    description:
      "Capitale des provinces du Sud, ville dynamique ouverte sur l'Atlantique avec une culture hassanie préservée. Paysages sahariennes grandioses et côtes vierges.",
    color: "#c7d2fe",
    hoverColor: "#6366f1",
    cities: ["Laâyoune", "Boujdour", "Smara"],
    sites: [
      {
        id: "laayoune",
        name: "Laâyoune",
        city: "Laâyoune",
        icon: "🕌",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=La%C3%A2youne+Maroc",
        description:
          "Capitale saharienne, mosquée des martyrs et marché central. Ville en plein essor avec une architecture moderne et une culture hassanie vivante, reflet de son identité unique.",
        tips: [
          "Visitez le marché du tapis pour des pièces artisanales sahraouies uniques.",
          "L'hospitalité sahraoui (thé à la menthe) est une expérience à saisir.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "plage-foum-el-oued",
        name: "Plage Foum El Oued",
        city: "Laâyoune",
        icon: "🌊",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Plage+Foum+El+Oued+La%C3%A2youne+Maroc",
        description:
          "Longue plage atlantique sauvage aux vagues puissantes, au sud de Laâyoune. Les dunes de sable plongent directement dans l'océan dans un panorama saisissant.",
        tips: [
          "Accès en taxi ou voiture depuis Laâyoune (30 min) — rien sur place, apportez tout.",
          "Les courants sont forts — la baignade est déconseillée sans surveillance.",
        ],
        tags: ["plage"],
      },
      {
        id: "erg-lakhbayate",
        name: "Erg Lakhbayate",
        city: "Laâyoune",
        icon: "🏜️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Erg+Lakhbayate+La%C3%A2youne+Maroc",
        description:
          "Champs de dunes aux couleurs orangées en bordure de la ville de Laâyoune. Un Sahara accessible depuis la capitale, idéal pour les couchers de soleil et les promenades.",
        tips: [
          "Accessible à pied ou en taxi depuis le centre de Laâyoune.",
          "Meilleur moment : coucher de soleil pour les lumières dorées sur les dunes.",
        ],
        tags: ["désert", "paysage"],
      },
      {
        id: "smara",
        name: "Smara",
        city: "Smara",
        icon: "🏛️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Smara+palais+Ma+el-A%C3%AFnine+Maroc",
        description:
          "Ville saharienne historique et vestiges du palais Ma el-Aïnine, fondateur du mouvement de résistance contre les colonisateurs. Site chargé d'histoire et de spiritualité.",
        tips: [
          "Consultez les conditions d'accès avant de partir — route longue dans le désert.",
          "Le palais Ma el-Aïnine est le principal intérêt historique de la ville.",
        ],
        tags: ["patrimoine"],
      },
      {
        id: "cote-atlantique-saharienne",
        name: "Côte atlantique saharienne",
        city: "Laâyoune",
        icon: "🏄",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=C%C3%B4te+atlantique+saharienne+La%C3%A2youne+Maroc",
        description:
          "Pêche sportive, surf et kitesurf sur 500 km de côtes vierges. Vents réguliers toute l'année et vagues puissantes attirent les amateurs de sports nautiques du monde entier.",
        tips: [
          "Vents réguliers toute l'année — paradis du kitesurf et du windsurf.",
          "Les eaux sont froides même en été (courant des Canaries) — combinaison conseillée.",
        ],
        tags: ["plage", "nature"],
      },
    ],
  },
  {
    id: "MA12",
    name: "Dakhla-Oued Ed-Dahab",
    capital: "Dakhla",
    description:
      "Paradis des sports nautiques et de l'aventure saharienne à l'extrême sud du Maroc. Le lagon de Dakhla est reconnu comme la meilleure destination mondiale de kitesurf.",
    color: "#a5f3fc",
    hoverColor: "#06b6d4",
    cities: ["Dakhla", "Aousserd"],
    sites: [
      {
        id: "lagune-dakhla",
        name: "Lagune de Dakhla",
        city: "Dakhla",
        icon: "🏄",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Lagune+de+Dakhla+kitesurf+Maroc",
        description:
          "Lagon turquoise de 40 km, eldorado mondial du kitesurf. Eaux protégées des vents atlantiques, conditions idéales toute l'année pour les sports de glisse.",
        tips: [
          "Réservez les sessions de kitesurf auprès d'écoles agréées uniquement.",
          "La saison optimale est novembre à avril pour les meilleurs vents.",
        ],
        tags: ["nature", "plage"],
      },
      {
        id: "dunes-dakhla",
        name: "Dunes de Dakhla",
        city: "Dakhla",
        icon: "🏜️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Dunes+de+Dakhla+d%C3%A9sert+Maroc",
        description:
          "Dunes sahariennes plongeant directement dans l'Océan, paysage unique au monde. Le contraste entre le désert de sable et l'Atlantique bleu est un spectacle saisissant.",
        tips: [
          "Les excursions en 4x4 se réservent auprès des agences locales de Dakhla.",
          "Le coucher de soleil sur le désert depuis la péninsule est absolument magique.",
        ],
        tags: ["désert", "paysage"],
      },
      {
        id: "ile-dakhla",
        name: "Île de Dakhla",
        city: "Dakhla",
        icon: "🏝️",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=%C3%8Ele+de+Dakhla+Maroc",
        description:
          "Presqu'île sauvage aux eaux calmes et faune exceptionnelle (dauphins, tortues, flamants roses). Plages désertes et solitude absolue dans un cadre naturel préservé.",
        tips: [
          "Accessible uniquement par bateau ou 4x4 selon la marée — prévoir une journée.",
          "Idéal pour la plongée et le snorkeling dans des eaux cristallines.",
        ],
        tags: ["nature", "plage"],
      },
      {
        id: "oued-ed-dahab",
        name: "Oued Ed-Dahab",
        city: "Dakhla",
        icon: "🦩",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Oued+Ed-Dahab+flamants+roses+Dakhla+Maroc",
        description:
          "Oued aux flamants roses et hérons, pêche traditionnelle dans un cadre saharien unique. Les eaux saumâtres attirent des centaines d'oiseaux migrateurs chaque saison.",
        tips: [
          "Visitez à l'aube ou au crépuscule pour observer les flamants roses en vol.",
          "Un guide ornithologique enrichit considérablement la visite.",
        ],
        tags: ["nature"],
      },
      {
        id: "village-lassarga",
        name: "Village de pêcheurs de Lassarga",
        city: "Dakhla",
        icon: "🎣",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Lassarga+village+p%C3%AAcheurs+Dakhla+Maroc",
        description:
          "Vie saharienne authentique et pêche artisanale dans ce village de pêcheurs préservé. Les habitants perpétuent des techniques de pêche traditionnelles dans l'Atlantique.",
        tips: [
          "Achetez le poisson directement aux pêcheurs au retour des bateaux le matin.",
          "L'accueil des habitants est chaleureux — respectez les coutumes locales.",
        ],
        tags: ["patrimoine", "paysage"],
      },
    ],
  },
];
