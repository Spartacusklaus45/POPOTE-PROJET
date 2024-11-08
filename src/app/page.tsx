import { Suspense } from 'react';
import { RecipeList } from '@/features/recipes/components/RecipeList';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Découvrez nos recettes
        </h1>
        <SearchBar />
        <Suspense fallback={<LoadingSpinner />}>
          <RecipeList />
        </Suspense>
      </div>
    </main>
  );
}