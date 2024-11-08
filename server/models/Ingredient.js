import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    unique: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'cereals',
      'proteins',
      'vegetables',
      'fruits',
      'spices',
      'dairy',
      'oils',
      'nuts',
      'legumes',
      'other'
    ]
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'La quantité ne peut pas être négative']
  },
  unit: {
    type: String,
    required: true,
    enum: [
      'g',
      'kg',
      'ml',
      'l',
      'pièce',
      'botte',
      'sachet',
      'cuillère à soupe',
      'cuillère à café'
    ]
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Le prix ne peut pas être négatif']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Le stock ne peut pas être négatif']
  },
  nutritionalScore: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'N/A'],
    default: 'N/A'
  },
  ecoScore: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'N/A'],
    default: 'N/A'
  },
  novaScore: {
    type: Number,
    min: 1,
    max: 4
  },
  imageUrl: String,
  origin: String,
  isLocal: {
    type: Boolean,
    default: false
  },
  seasonality: [{
    type: String,
    enum: [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre'
    ]
  }],
  nutriments: {
    energy: Number,
    proteins: Number,
    carbohydrates: Number,
    fat: Number,
    fiber: Number
  }
}, {
  timestamps: true
});

export const Ingredient = mongoose.model('Ingredient', ingredientSchema);