import Storage "mo:caffeineai-object-storage/Storage";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Stripe "mo:caffeineai-stripe/stripe";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import List "mo:core/List";
import VarArray "mo:core/VarArray";





actor {
  type PostId = Nat;
  type ProductId = Nat;
  type TransportRouteId = Nat;

  public type UserStatus = {
    #free;
    #premium;
  };

  public type PointsTransaction = {
    transactionId : Nat;
    userId : Principal;
    amount : Nat;
    reason : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    username : Text;
    country : Text;
    email : ?Text;
    status : UserStatus;
    quizScore : Nat;
    earnedBadges : [Text];
    tipsGiven : Nat;
    scamsReported : Nat;
    firstPostCreated : Bool;
    points : Nat;
  };

  public type Badge = {
    id : Text;
    name : Text;
    description : Text;
    icon : Text;
    earned : Bool;
  };

  public type QuizQuestion = {
    questionText : Text;
    scenarioImageUrl : Text;
    options : [Text];
    correctAnswerIndex : Nat;
    explanation : Text;
  };

  public type Tip = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    helpfulCount : Nat;
  };

  public type ScamStory = {
    title : Text;
    story : Text;
    scamType : Text;
    warningSigns : [Text];
    lessonsLearned : [Text];
    reportedBy : Principal;
    timestamp : Time.Time;
  };

  public type Comment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    timestamp : Int;
  };

  public type Post = {
    id : PostId;
    imageBlob : ?Storage.ExternalBlob;
    content : Text;
    timestamp : Time.Time;
    author : Principal;
    ville : Text;
    titre : Text;
    experience : Text;
    categorie : Text;
    scamVotes : [Principal];
    fairDealVotes : [Principal];
  };

  public type Product = {
    id : ProductId;
    imageBlob : ?Storage.ExternalBlob;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    seller : Principal;
  };

  public type TransportRoute = {
    id : TransportRouteId;
    origin : Text;
    destination : Text;
    transportMode : TransportMode;
    price : Nat;
    duration : Nat;
    advice : Text;
  };

  public type PremiumProduct = {
    id : Nat;
    imageBlob : ?Storage.ExternalBlob;
    title : Text;
    description : Text;
    priceTag : Text;
  };

  public type TransportMode = {
    #publicTransport;
    #sharedTaxi;
    #bus;
    #luxuryTransport;
    #rentalCar;
    #train;
    #guide;
  };

  public type RegionPrice = {
    min : Nat;
    max : Nat;
  };

  public type ProductPriceRange = {
    marrakech : RegionPrice;
    fes : RegionPrice;
    casablanca : RegionPrice;
  };

  public type TraditionalProduct = {
    name : Text;
    description : Text;
    category : Text;
    priceRanges : ProductPriceRange;
    seasonalVariationPercent : Nat;
    negotiationTips : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinObjectStorage();

  var nextPostId : Nat = 1;
  var nextTipId : Nat = 1;
  var nextProductId : Nat = 1;
  var nextPremiumContentId : Nat = 1;
  var nextTransportRouteId : Nat = 1;
  var nextTransactionId : Nat = 1;
  var nextCommentId : Nat = 1;

  let users = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<PostId, Post>();
  let products = Map.empty<ProductId, Product>();
  let premiumProducts = Map.empty<Nat, PremiumProduct>();
  let transportRoutes = Map.empty<TransportRouteId, TransportRoute>();
  let tips = Map.empty<Nat, Tip>();
  let scamStories = Map.empty<Nat, ScamStory>();
  let quizQuestions = Map.empty<Nat, QuizQuestion>();
  let badges = Map.empty<Text, Badge>();
  let transactionHistory = Map.empty<Principal, List.List<PointsTransaction>>();
  let comments = Map.empty<Nat, Comment>();
  let traditionalProducts = Map.empty<Nat, TraditionalProduct>();

  public type Reclamation = {
    id : Nat;
    description : Text;
    whatTheySell : Text;
    city : Text;
    location : Text;
    timestamp : Int;
    author : Principal;
    helpfulCount : Nat;
  };

  let reclamations = Map.empty<Nat, Reclamation>();
  var nextReclamationId : Nat = 1;

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  module PremiumProduct {
    public func compareByTitle(item1 : PremiumProduct, item2 : PremiumProduct) : Order.Order {
      Text.compare(item1.title, item2.title);
    };
  };

  module TransportRoute {
    public func compareByDestination(item1 : TransportRoute, item2 : TransportRoute) : Order.Order {
      Text.compare(item1.destination, item2.destination);
    };
  };

  public type InitializationState = {
    isTraditionalProductsInitialized : Bool;
  };

  var initializationState : ?InitializationState = ?{
    isTraditionalProductsInitialized = false;
  };

  public shared ({ caller }) func initializeTraditionalProducts() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let isInitialized = switch (initializationState) {
      case (?state) { state.isTraditionalProductsInitialized };
      case (null) { false };
    };

    if (not isInitialized) {
      addTraditionalProducts();
      initializationState := ?{
        isTraditionalProductsInitialized = true;
      };
    };
  };

  // Public catalog queries - accessible to all including guests
  public query ({ caller }) func getAllTraditionalProducts() : async [TraditionalProduct] {
    traditionalProducts.values().toArray();
  };

  public query ({ caller }) func getTraditionalProductsByCategory(category : Text) : async [TraditionalProduct] {
    traditionalProducts.values().toArray().filter(
      func(product) { Text.equal(product.category, category) }
    );
  };

  public query ({ caller }) func getTraditionalProductById(id : Nat) : async ?TraditionalProduct {
    traditionalProducts.get(id);
  };

  public query ({ caller }) func getTraditionalProductsByRegion(region : Text) : async [TraditionalProduct] {
    traditionalProducts.values().toArray().map(
      func(product) {
        let regionalPrices = switch (region) {
          case ("Marrakech") { product.priceRanges.marrakech };
          case ("Fès") { product.priceRanges.fes };
          case ("Casablanca") { product.priceRanges.casablanca };
          case (_) { product.priceRanges.marrakech };
        };
        {
          name = product.name;
          description = product.description;
          category = product.category;
          priceRanges = {
            marrakech = regionalPrices;
            fes = regionalPrices;
            casablanca = regionalPrices;
          };
          seasonalVariationPercent = product.seasonalVariationPercent;
          negotiationTips = product.negotiationTips;
        };
      }
    );
  };

  public query ({ caller }) func filterTraditionalProducts(category : ?Text, minPrice : ?Nat, maxPrice : ?Nat, region : ?Text) : async [TraditionalProduct] {
    var productsArray = traditionalProducts.values().toArray();

    switch (category) {
      case (?cat) {
        productsArray := productsArray.filter(
          func(product) { Text.equal(product.category, cat) }
        );
      };
      case (null) {};
    };

    switch ((minPrice, maxPrice)) {
      case (?min, ?max) {
        productsArray := productsArray.filter(
          func(product) {
            let prices = switch (region) {
              case (?r) {
                switch (r) {
                  case ("Marrakech") { product.priceRanges.marrakech };
                  case ("Fès") { product.priceRanges.fes };
                  case ("Casablanca") { product.priceRanges.casablanca };
                  case (_) { product.priceRanges.marrakech };
                };
              };
              case (null) { product.priceRanges.marrakech };
            };
            prices.min >= min and prices.max <= max
          }
        );
      };
      case ((?min, null)) {
        productsArray := productsArray.filter(
          func(product) {
            let prices = switch (region) {
              case (?r) {
                switch (r) {
                  case ("Marrakech") { product.priceRanges.marrakech };
                  case ("Fès") { product.priceRanges.fes };
                  case ("Casablanca") { product.priceRanges.casablanca };
                  case (_) { product.priceRanges.marrakech };
                };
              };
              case (null) { product.priceRanges.marrakech };
            };
            prices.min >= min;
          }
        );
      };
      case ((null, ?max)) {
        productsArray := productsArray.filter(
          func(product) {
            let prices = switch (region) {
              case (?r) {
                switch (r) {
                  case ("Marrakech") { product.priceRanges.marrakech };
                  case ("Fès") { product.priceRanges.fes };
                  case ("Casablanca") { product.priceRanges.casablanca };
                  case (_) { product.priceRanges.marrakech };
                };
              };
              case (null) { product.priceRanges.marrakech };
            };
            prices.max <= max;
          }
        );
      };
      case ((null, null)) {};
    };

    switch (region) {
      case (?r) {
        productsArray := productsArray.map(
          func(product) {
            let regionalPrices = switch (r) {
              case ("Marrakech") { product.priceRanges.marrakech };
              case ("Fès") { product.priceRanges.fes };
              case ("Casablanca") { product.priceRanges.casablanca };
              case (_) { product.priceRanges.marrakech };
            };
            {
              name = product.name;
              description = product.description;
              category = product.category;
              priceRanges = {
                marrakech = regionalPrices;
                fes = regionalPrices;
                casablanca = regionalPrices;
              };
              seasonalVariationPercent = product.seasonalVariationPercent;
              negotiationTips = product.negotiationTips;
            };
          }
        );
      };
      case (null) {};
    };

    productsArray;
  };

  func addTraditionalProducts() {
    let productsList = [
      {
        name = "Tapis berbère";
        description = "Tapis artisanal en laine, noué à la main, motifs géométriques berbères. Origine : Haut Atlas. Dimensions : 2x3m";
        category = "Textiles";
        priceRanges = {
          marrakech = { min = 2000; max = 6000 };
          fes = { min = 1800; max = 5800 };
          casablanca = { min = 2500; max = 7000 };
        };
        seasonalVariationPercent = 15;
        negotiationTips = "Négociez 20-30% du prix, montrez plusieurs tapis, comparez les tailles et la densité des fibres.";
      },
      {
        name = "Tajine céramique";
        description = "Plat traditionnel en céramique, décorations Fez bleues, diamètre 30cm, adapté à la cuisson.";
        category = "Céramiques";
        priceRanges = {
          marrakech = { min = 120; max = 250 };
          fes = { min = 100; max = 220 };
          casablanca = { min = 150; max = 300 };
        };
        seasonalVariationPercent = 10;
        negotiationTips = "Demandez des lots, vérifiez l'authenticité du glaçage alimentaire. Comparez les prix selon la taille.";
      },
      {
        name = "Babouches cuir";
        description = "Chaussons en cuir tanné naturellement, cousues main, variété de couleurs et tailles (35-46).";
        category = "Cuir";
        priceRanges = {
          marrakech = { min = 80; max = 200 };
          fes = { min = 70; max = 180 };
          casablanca = { min = 100; max = 250 };
        };
        seasonalVariationPercent = 12;
        negotiationTips = "Essayez plusieurs paires, vérifiez la souplesse du cuir, regroupez les achats pour réduire le prix.";
      },
      {
        name = "Coussin kilim";
        description = "Housse de coussin en laine recyclée, motifs berbères, 40x40cm, couleurs naturelles.";
        category = "Textiles";
        priceRanges = {
          marrakech = { min = 120; max = 280 };
          fes = { min = 100; max = 250 };
          casablanca = { min = 150; max = 320 };
        };
        seasonalVariationPercent = 18;
        negotiationTips = "Négociez 25% sur le prix initial, achetez par lot pour un meilleur tarif, vérifiez la qualité des coutures.";
      },
      {
        name = "Assiette artisanale";
        description = "Assiette peinte à la main, motifs andalous, diamètre 25cm, céramique alimentair";
        category = "Céramiques";
        priceRanges = {
          marrakech = { min = 80; max = 180 };
          fes = { min = 70; max = 160 };
          casablanca = { min = 100; max = 220 };
        };
        seasonalVariationPercent = 8;
        negotiationTips = "Vérifiez uniformité peinture, achetez lot 4-6 pour réduction, comparez avec articles similaires.";
      },
      {
        name = "Pouf marocain";
        description = "Pouf en cuir naturel, cousu main, disponible en plusieurs couleurs, diamètre 50cm.";
        category = "Cuir";
        priceRanges = {
          marrakech = { min = 350; max = 750 };
          fes = { min = 320; max = 700 };
          casablanca = { min = 400; max = 850 };
        };
        seasonalVariationPercent = 14;
        negotiationTips = "Demandez garnissage inclus, vérifiez qualité couture, négociez si achat multiple.";
      },
      {
        name = "Coffret à épices";
        description = "Boîte en bois de thuya, compartiments intérieurs, motifs sculptés à la main.";
        category = "Bois";
        priceRanges = {
          marrakech = { min = 180; max = 380 };
          fes = { min = 160; max = 350 };
          casablanca = { min = 200; max = 420 };
        };
        seasonalVariationPercent = 11;
        negotiationTips = "Comparez essences bois, vérifiez fermeture, négociez 15-20% selon complexité sculpture.";
      },
      {
        name = "Huile d'argan cosmétique";
        description = "Huile pure 100ml, certifiée bio, origine Sud Maroc, flacon verre teinté.";
        category = "Huile d'argan";
        priceRanges = {
          marrakech = { min = 80; max = 120 };
          fes = { min = 70; max = 110 };
          casablanca = { min = 90; max = 130 };
        };
        seasonalVariationPercent = 7;
        negotiationTips = "Vérifiez certification, achetez par 2-3 bouteilles pour remise, préférez huile pressée à froid.";
      },
      {
        name = "Set lanternes ajourées";
        description = "Ensemble 3 lanternes, métal ciselé, différents motifs géométriques, hauteur 20-45cm.";
        category = "Lanternes et luminaires";
        priceRanges = {
          marrakech = { min = 320; max = 780 };
          fes = { min = 290; max = 720 };
          casablanca = { min = 350; max = 830 };
        };
        seasonalVariationPercent = 13;
        negotiationTips = "Demandez réduction pour set complet, vérifiez qualité soudures, comparez tailles.";
      },
      {
        name = "Ras el hanout - mélange d'épices";
        description = "Pot en terre cuite 100g, mélange traditionnel 12 épices, origine sud Maroc.";
        category = "Épices";
        priceRanges = {
          marrakech = { min = 40; max = 70 };
          fes = { min = 35; max = 65 };
          casablanca = { min = 50; max = 80 };
        };
        seasonalVariationPercent = 9;
        negotiationTips = "Vérifiez fraîcheur, demandez composition exacte, achetez lot pour réduction.";
      },
      {
        name = "Plats de service zellige";
        description = "Plateau en marbre 40cm, incrustations mosaïque zellige, motifs traditionnels.";
        category = "Céramiques";
        priceRanges = {
          marrakech = { min = 980; max = 2600 };
          fes = { min = 900; max = 2400 };
          casablanca = { min = 1100; max = 2800 };
        };
        seasonalVariationPercent = 17;
        negotiationTips = "Négociez fermement, comparez finitions, vérifiez équilibre plateau.";
      },
      {
        name = "Boucles d'oreilles argent Amzigh";
        description = "Bijoux en argent massif 925, motifs berbères, incrustations pierres semi-préieuses.";
        category = "Bijoux";
        priceRanges = {
          marrakech = { min = 180; max = 470 };
          fes = { min = 160; max = 430 };
          casablanca = { min = 220; max = 520 };
        };
        seasonalVariationPercent = 14;
        negotiationTips = "Vérifiez poinçon argent, comparez poids, demandez test aimant.";
      },
      {
        name = "Épices safran premium";
        description = "Sachet 1g, origine Taliouine, qualité premium, certification région d'origine.";
        category = "Épices";
        priceRanges = {
          marrakech = { min = 350; max = 620 };
          fes = { min = 320; max = 580 };
          casablanca = { min = 380; max = 680 };
        };
        seasonalVariationPercent = 16;
        negotiationTips = "Vérifiez arôme, demandez test couleur dans l'eau, négociez 10-15%.";
      },
      {
        name = "Miroir cuivre sculpté";
        description = "Cadre miroir 35x40cm, sculptures traditionnelles, finition patinée.";
        category = "Bois";
        priceRanges = {
          marrakech = { min = 660; max = 1450 };
          fes = { min = 600; max = 1370 };
          casablanca = { min = 740; max = 1550 };
        };
        seasonalVariationPercent = 15;
        negotiationTips = "Négociez selon taille, comparez finitions, vérifiez stabilité fixation.";
      },
      {
        name = "Sabra textile coussin";
        description = "Housse coussin 45x45cm, fibres naturelles de cactus, teintures végétales.";
        category = "Textiles";
        priceRanges = {
          marrakech = { min = 140; max = 320 };
          fes = { min = 120; max = 290 };
          casablanca = { min = 170; max = 350 };
        };
        seasonalVariationPercent = 12;
        negotiationTips = "Valorisez l'authenticité, comparez textures, achetez par deux pour remise.";
      },
      {
        name = "Huile d'argan alimentaire bio";
        description = "Bouteille 250ml, première pression à froid, goût subtil noisette.";
        category = "Huile d'argan";
        priceRanges = {
          marrakech = { min = 140; max = 210 };
          fes = { min = 130; max = 200 };
          casablanca = { min = 160; max = 230 };
        };
        seasonalVariationPercent = 9;
        negotiationTips = "Vérifiez label origine, achetez lot huiles variées pour réduction.";
      },
      {
        name = "Coussin porte alliances mariage";
        description = "Support alliances brodé à la main, dentelle marocaine, motifs floraux.";
        category = "Textiles";
        priceRanges = {
          marrakech = { min = 270; max = 690 };
          fes = { min = 250; max = 640 };
          casablanca = { min = 300; max = 750 };
        };
        seasonalVariationPercent = 13;
        negotiationTips = "Demandez personnalisation, négociez en lot accessoires de mariage.";
      },
      {
        name = "Sac à main cuir artisan";
        description = "Sac cousu main, cuir pleine fleur naturel, ajourages traditionnels, lanière ajustable.";
        category = "Cuir";
        priceRanges = {
          marrakech = { min = 550; max = 1550 };
          fes = { min = 500; max = 1450 };
          casablanca = { min = 600; max = 1750 };
        };
        seasonalVariationPercent = 16;
        negotiationTips = "Vérifiez coutures, demandez certificat cuir naturel, valorisez fabrication artisanale.";
      },
      {
        name = "Étagère murale bois citronnier";
        description = "Étagère sculptée main, motifs géométriques, bois citronnier, dimensions 40x100cm.";
        category = "Bois";
        priceRanges = {
          marrakech = { min = 760; max = 2100 };
          fes = { min = 700; max = 1980 };
          casablanca = { min = 800; max = 2300 };
        };
        seasonalVariationPercent = 15;
        negotiationTips = "Comparez qualité travail bois, négociez selon épaisseur et finitions.";
      }
    ];
    var index = 1;
    for (product in productsList.values()) {
      traditionalProducts.add(index, product);
      index += 1;
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    users.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  public shared ({ caller }) func updateUsername(newUsername : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update username");
    };
    let userProfile = getOrCreateUserProfile(caller);
    let updatedProfile = { userProfile with username = newUsername };
    users.add(caller, updatedProfile);
  };

  public query ({ caller }) func getUsername(user : Principal) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view usernames");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own username");
    };
    let userProfile = getOrCreateUserProfile(user);
    userProfile.username;
  };

  public shared ({ caller }) func updateCountry(newCountry : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update country");
    };
    let userProfile = getOrCreateUserProfile(caller);
    let updatedProfile = { userProfile with country = newCountry };
    users.add(caller, updatedProfile);
  };

  public query ({ caller }) func getCountry(user : Principal) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view country");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own country");
    };
    let userProfile = getOrCreateUserProfile(user);
    userProfile.country;
  };

  // Post Extension
  public shared ({ caller }) func createPost(content : Text, ville : Text, titre : Text, experience : Text, categorie : Text, imageBlob : ?Storage.ExternalBlob) : async PostId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let post : Post = {
      id = nextPostId;
      content;
      timestamp = Time.now();
      imageBlob;
      author = caller;
      ville;
      titre;
      experience;
      categorie;
      scamVotes = [];
      fairDealVotes = [];
    };
    posts.add(nextPostId, post);
    nextPostId += 1;
    post.id;
  };

  // Public content queries - accessible to all including guests
  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray();
  };

  // Tips
  public shared ({ caller }) func createTip(content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tips");
    };

    let tip : Tip = {
      id = nextTipId;
      content;
      timestamp = Time.now();
      author = caller;
      helpfulCount = 0;
    };
    tips.add(nextTipId, tip);
    nextTipId += 1;
    tip.id;
  };

  public query ({ caller }) func getAllTips() : async [Tip] {
    tips.values().toArray();
  };

  // User-created Products
  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Nat, category : Text, imageBlob : ?Storage.ExternalBlob) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create products");
    };

    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      category;
      imageBlob;
      seller = caller;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getPost(postId : PostId) : async ?Post {
    posts.get(postId);
  };

  // Delete a post — only the original author can delete
  public shared ({ caller }) func deletePost(postId : PostId) : async { #ok; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only users can delete posts");
    };
    switch (posts.get(postId)) {
      case (null) { #err("Post not found") };
      case (?post) {
        if (post.author != caller) {
          return #err("Unauthorized: You can only delete your own posts");
        };
        ignore posts.remove(postId);
        #ok;
      };
    };
  };

  // Update a post's title and content — only the original author can update
  public shared ({ caller }) func updatePost(postId : PostId, newTitre : Text, newContent : Text) : async { #ok; #err : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only users can update posts");
    };
    switch (posts.get(postId)) {
      case (null) { #err("Post not found") };
      case (?post) {
        if (post.author != caller) {
          return #err("Unauthorized: You can only update your own posts");
        };
        let updatedPost = { post with titre = newTitre; content = newContent };
        posts.add(postId, updatedPost);
        #ok;
      };
    };
  };

  // Comments Functionality
  public shared ({ caller }) func addComment(postId : Nat, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };

    let comment : Comment = {
      id = nextCommentId;
      postId;
      author = caller;
      content;
      timestamp = Time.now();
    };
    comments.add(nextCommentId, comment);
    nextCommentId += 1;
    comment.id;
  };

  public query ({ caller }) func getComments(postId : Nat) : async [Comment] {
    comments.values().toArray().filter(
      func(comment) {
        comment.postId == postId;
      }
    );
  };

  // Scam and Fair Deal Voting
  public shared ({ caller }) func voteScam(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can vote");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        if (post.scamVotes.find(func(voter) { voter == caller }) != null) {
          Runtime.trap("Already voted as scam");
        };

        let newScamVotes = post.scamVotes.concat([caller]);
        let newFairDealVotes = post.fairDealVotes.filter(
          func(voter) { voter != caller }
        );

        let updatedPost = {
          post with
          scamVotes = newScamVotes;
          fairDealVotes = newFairDealVotes;
        };
        posts.add(postId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func voteFairDeal(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can vote");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        if (post.fairDealVotes.find(func(voter) { voter == caller }) != null) {
          Runtime.trap("Already voted as fair deal");
        };

        let newFairDealVotes = post.fairDealVotes.concat([caller]);
        let newScamVotes = post.scamVotes.filter(
          func(voter) { voter != caller }
        );

        let updatedPost = {
          post with
          fairDealVotes = newFairDealVotes;
          scamVotes = newScamVotes;
        };
        posts.add(postId, updatedPost);
      };
    };
  };

  // Réclamations (vendor complaints)
  public query ({ caller }) func getAllReclamations() : async [Reclamation] {
    reclamations.values().toArray();
  };

  public shared ({ caller }) func createReclamation(description : Text, whatTheySell : Text, city : Text, location : Text) : async Reclamation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit reclamations");
    };

    let reclamation : Reclamation = {
      id = nextReclamationId;
      description;
      whatTheySell;
      city;
      location;
      timestamp = Time.now();
      author = caller;
      helpfulCount = 0;
    };
    reclamations.add(nextReclamationId, reclamation);
    nextReclamationId += 1;
    reclamation;
  };

  public shared ({ caller }) func voteReclamationHelpful(id : Nat) : async ?Reclamation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can vote on reclamations");
    };

    switch (reclamations.get(id)) {
      case (null) { null };
      case (?r) {
        let updated = { r with helpfulCount = r.helpfulCount + 1 };
        reclamations.add(id, updated);
        ?updated;
      };
    };
  };

  // Stripe Integration
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Premium Products - public catalog queries accessible to all including guests
  public query ({ caller }) func getAllPremiumProducts() : async [PremiumProduct] {
    premiumProducts.values().toArray();
  };

  public query ({ caller }) func getPremiumProduct(id : Nat) : async ?PremiumProduct {
    premiumProducts.get(id);
  };

  public shared ({ caller }) func addPremiumProduct(product : PremiumProduct) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add premium products");
    };

    let productWithId = { product with id = nextPremiumContentId };
    premiumProducts.add(nextPremiumContentId, productWithId);
    nextPremiumContentId += 1;
  };

  public shared ({ caller }) func updateEmail(email : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update email");
    };
    let userProfile = getOrCreateUserProfile(caller);
    let updatedProfile = { userProfile with email = ?email };
    users.add(caller, updatedProfile);
  };

  func getOrCreateUserProfile(user : Principal) : UserProfile {
    switch (users.get(user)) {
      case (null) {
        let newProfile : UserProfile = {
          name = "";
          username = "";
          country = "";
          email = null;
          status = #free;
          quizScore = 0;
          earnedBadges = [];
          tipsGiven = 0;
          scamsReported = 0;
          firstPostCreated = false;
          points = 0;
        };
        users.add(user, newProfile);
        newProfile;
      };
      case (?profile) { profile };
    };
  };
};
