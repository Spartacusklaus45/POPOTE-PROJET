import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Recipe } from '../types';

// Add the type definition for the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = async (recipe: Recipe) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(24);
  doc.text(recipe.name, 20, 20);
  
  // Main information
  doc.setFontSize(12);
  doc.text(`Temps de préparation: ${recipe.preparationTime} min`, 20, 35);
  doc.text(`Nombre de personnes: ${recipe.servings}`, 20, 42);
  doc.text(`Difficulté: ${recipe.difficulty}`, 20, 49);
  
  // Scores
  doc.text(`Nutri-score: ${recipe.nutritionalScore}`, 20, 60);
  doc.text(`Éco-score: ${recipe.ecoScore}`, 20, 67);
  doc.text(`Score NOVA: ${recipe.novaScore}`, 20, 74);
  
  // Ingredients
  doc.setFontSize(16);
  doc.text('Ingrédients', 20, 90);
  
  const ingredientsData = recipe.ingredients.map(ingredient => [
    ingredient.name,
    `${ingredient.quantity} ${ingredient.unit}`
  ]);
  
  doc.autoTable({
    startY: 95,
    head: [['Ingrédient', 'Quantité']],
    body: ingredientsData,
    theme: 'grid'
  });
  
  // Instructions
  doc.setFontSize(16);
  doc.text('Instructions', 20, doc.autoTable.previous.finalY + 20);
  
  const instructionsData = recipe.instructions.map((instruction, index) => [
    `${index + 1}`,
    instruction
  ]);
  
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 25,
    head: [['Étape', 'Instructions']],
    body: instructionsData,
    theme: 'grid'
  });

  // Nutritional information if available
  if (recipe.nutrients) {
    doc.setFontSize(16);
    doc.text('Informations nutritionnelles', 20, doc.autoTable.previous.finalY + 20);

    const nutritionData = [
      ['Calories', `${recipe.nutrients.calories} kcal`],
      ['Protéines', `${recipe.nutrients.proteins} g`],
      ['Glucides', `${recipe.nutrients.carbohydrates} g`],
      ['Lipides', `${recipe.nutrients.fat} g`],
      ['Fibres', `${recipe.nutrients.fiber || 0} g`]
    ];

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 25,
      head: [['Nutriment', 'Valeur']],
      body: nutritionData,
      theme: 'grid'
    });
  }
  
  // Download the PDF
  doc.save(`${recipe.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};