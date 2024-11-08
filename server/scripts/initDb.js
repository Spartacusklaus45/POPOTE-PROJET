import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import de tous les modèles
import { DietaryPreference } from '../models/DietaryPreference.js';
import { User } from '../models/User.js';
import { Recipe } from '../models/Recipe.js';
import { Order } from '../models/Order.js';
import { Review } from '../models/Review.js';
import { Creator } from '../models/Creator.js';
import { Ingredient } from '../models/Ingredient.js';
import { KitchenEquipment } from '../models/KitchenEquipment.js';
import { MealPlan } from '../models/MealPlan.js';
import { Notification } from '../models/Notification.js';
import { ExternalAPI } from '../models/ExternalAPI.js';
import { APILog } from '../models/APILog.js';
import { APIMetric } from '../models/APIMetric.js';
import { LoyaltyCard } from '../models/LoyaltyCard.js';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Erreur: MONGO_URI non défini dans le fichier .env');
  process.exit(1);
}

const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'),
};

async function initializeDatabase() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGO_URI, DB_OPTIONS);
    console.log('Connecté à MongoDB avec succès.');

    // Liste de tous les modèles à initialiser
    const models = [
      { name: 'users', Model: User },
      { name: 'recipes', Model: Recipe },
      { name: 'orders', Model: Order },
      { name: 'reviews', Model: Review },
      { name: 'creators', Model: Creator },
      { name: 'ingredients', Model: Ingredient },
      { name: 'kitchenEquipment', Model: KitchenEquipment },
      { name: 'mealPlans', Model: MealPlan },
      { name: 'notifications', Model: Notification },
      { name: 'externalAPIs', Model: ExternalAPI },
      { name: 'apiLogs', Model: APILog },
      { name: 'apiMetrics', Model: APIMetric },
      { name: 'loyaltyCards', Model: LoyaltyCard },
      { name: 'dietaryPreferences', Model: DietaryPreference }
    ];

    // Création des collections
    for (const { name, Model } of models) {
      const collectionExists = await mongoose.connection.db
        .listCollections({ name })
        .hasNext();
      
      if (!collectionExists) {
        await mongoose.connection.db.createCollection(name);
        console.log(`Collection créée: ${name}`);
      } else {
        console.log(`Collection ${name} existe déjà`);
      }
    }

    // Initialisation des préférences alimentaires
    await DietaryPreference.deleteMany({});
    
    const dietaryPreferences = [
      {
        type: 'VEGETARIAN',
        description: 'Exclut toute viande mais permet les produits laitiers et les œufs',
        restrictions: [],
        recommendations: [
          'Privilégier les légumineuses pour les protéines',
          'Assurer un apport suffisant en vitamine B12',
          'Varier les sources de protéines végétales'
        ],
        warnings: [
          'Attention à l\'apport en fer',
          'Surveiller l\'apport en protéines'
        ],
        guidelines: {
          maxCalories: 2000,
          maxCarbs: 300,
          maxProtein: 60,
          maxFat: 65
        }
      },
      {
        type: 'HALAL',
        description: 'Conforme aux prescriptions alimentaires islamiques',
        restrictions: [],
        recommendations: [
          'Vérifier la certification halal des viandes',
          'Éviter les produits contenant de l\'alcool'
        ],
        warnings: [
          'Attention aux additifs alimentaires'
        ]
      },
      {
        type: 'GLUTEN_FREE',
        description: 'Exclut tous les produits contenant du gluten',
        restrictions: [],
        recommendations: [
          'Privilégier les céréales sans gluten',
          'Vérifier les étiquettes des produits transformés'
        ],
        warnings: [
          'Attention à la contamination croisée',
          'Vérifier les sauces et condiments'
        ]
      }
    ];

    await DietaryPreference.insertMany(dietaryPreferences);
    console.log('Préférences alimentaires initialisées avec succès');

    // Initialisation des données de test pour les autres modèles si nécessaire
    // Vous pouvez ajouter ici l'initialisation d'autres données

    console.log('Initialisation de la base de données terminée.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

initializeDatabase();