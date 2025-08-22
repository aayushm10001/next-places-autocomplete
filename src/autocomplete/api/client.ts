import type { protos } from "@googlemaps/places";

// Type definitions
export type AutocompleteRequest =
  protos.google.maps.places.v1.IAutocompletePlacesRequest;
export type PlaceDetailsRequest =
  protos.google.maps.places.v1.IGetPlaceRequest & {
    requestedPlaceDetails: string[];
  };
export type PlacePrediction =
  protos.google.maps.places.v1.AutocompletePlacesResponse.Suggestion.IPlacePrediction;
export type PlaceDetails = protos.google.maps.places.v1.IPlace;

export async function autocomplete(
  request: AutocompleteRequest,
): Promise<PlacePrediction[]> {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACES_API_KEY;
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_PLACES_API_KEY is required");
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY!,
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    throw new Error(`Autocomplete request failed: ${response.statusText}`);
  }

  const result: protos.google.maps.places.v1.IAutocompletePlacesResponse =
    await response.json();

  return (
    result.suggestions
      ?.map((suggestion) => suggestion.placePrediction)
      .filter(
        (prediction): prediction is NonNullable<typeof prediction> =>
          prediction != null,
      ) ?? []
  );
}

export async function placeDetails(
  request: PlaceDetailsRequest,
): Promise<PlaceDetails> {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACES_API_KEY;
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_PLACES_API_KEY is required");
  }

  const { name, requestedPlaceDetails, ...queryParams } = request;

  if (!name) {
    throw new Error("Place name is required");
  }

  // Build query string from remaining parameters
  const searchParams = new URLSearchParams();

  // Add any additional query parameters that might be in the request
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value != null) {
      if (typeof value === "object") {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  const url = `https://places.googleapis.com/v1/${name}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": API_KEY!,
      "X-Goog-FieldMask": requestedPlaceDetails.join(","),
    },
  });

  if (!response.ok) {
    throw new Error(`Place details request failed: ${response.statusText}`);
  }

  const result: PlaceDetails = await response.json();
  return result;
}
