import { NextSeoProps } from 'next-seo';

export const getRecipeSEO = (recipe: any): NextSeoProps => ({
  title: recipe.name,
  description: recipe.description,
  openGraph: {
    title: recipe.name,
    description: recipe.description,
    images: [
      {
        url: recipe.imageUrl,
        width: 1200,
        height: 630,
        alt: recipe.name,
      },
    ],
  },
});

export const getCategorySEO = (category: any): NextSeoProps => ({
  title: `Recettes ${category.name}`,
  description: `Découvrez nos meilleures recettes de ${category.name}`,
  openGraph: {
    title: `Recettes ${category.name}`,
    description: `Découvrez nos meilleures recettes de ${category.name}`,
  },
});