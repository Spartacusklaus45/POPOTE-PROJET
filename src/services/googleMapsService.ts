import { useEffect, useState } from 'react';

// Clé API sécurisée via variables d'environnement
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export interface PlacePrediction {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

interface GoogleMapsError extends Error {
  code?: string;
  status?: string;
}

// Hook personnalisé pour charger l'API Google Maps
export function useGoogleMapsScript() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError(new Error('Clé API Google Maps non configurée'));
      return;
    }

    if (window.google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => setIsLoaded(true));
    script.addEventListener('error', () => 
      setError(new Error('Erreur lors du chargement de l\'API Google Maps'))
    );

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return { isLoaded, error };
}

// Service de prédiction de lieux
export async function getPlacePredictions(
  input: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken
): Promise<PlacePrediction[]> {
  if (!input.trim() || !window.google) {
    return [];
  }

  try {
    const autocompleteService = new google.maps.places.AutocompleteService();
    const request: google.maps.places.AutocompletionRequest = {
      input: input.trim(),
      componentRestrictions: { country: 'CI' },
      types: ['address'],
      sessionToken
    };

    const response = await new Promise<google.maps.places.AutocompletePrediction[]>(
      (resolve, reject) => {
        autocompleteService.getPlacePredictions(
          request,
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              resolve(predictions);
            } else {
              reject(new Error(`Erreur Google Maps: ${status}`));
            }
          }
        );
      }
    );

    return response.map(prediction => ({
      description: prediction.description,
      placeId: prediction.place_id,
      mainText: prediction.structured_formatting.main_text,
      secondaryText: prediction.structured_formatting.secondary_text
    }));
  } catch (error) {
    const mapError = error as GoogleMapsError;
    console.error('Erreur lors de la récupération des prédictions:', {
      message: mapError.message,
      code: mapError.code,
      status: mapError.status
    });
    return [];
  }
}

// Service de détails des lieux
export async function getPlaceDetails(
  placeId: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken
): Promise<google.maps.places.PlaceResult | null> {
  if (!placeId || !window.google) {
    return null;
  }

  try {
    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ['geometry', 'formatted_address', 'address_components'],
      sessionToken
    };

    const result = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject(new Error(`Erreur Google Maps: ${status}`));
        }
      });
    });

    return result;
  } catch (error) {
    const mapError = error as GoogleMapsError;
    console.error('Erreur lors de la récupération des détails du lieu:', {
      message: mapError.message,
      code: mapError.code,
      status: mapError.status
    });
    return null;
  }
}

// Fonction utilitaire pour extraire les composants d'adresse
export function extractAddressComponents(
  result: google.maps.places.PlaceResult
): {
  street?: string;
  district?: string;
  city?: string;
  country?: string;
} {
  const components: { [key: string]: string } = {};

  result.address_components?.forEach(component => {
    const types = component.types;

    if (types.includes('route')) {
      components.street = component.long_name;
    } else if (types.includes('sublocality_level_1')) {
      components.district = component.long_name;
    } else if (types.includes('locality')) {
      components.city = component.long_name;
    } else if (types.includes('country')) {
      components.country = component.long_name;
    }
  });

  return components;
}