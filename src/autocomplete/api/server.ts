"use server";

import type {
  AutocompleteRequest,
  PlaceDetails,
  PlaceDetailsRequest,
  PlacePrediction,
} from "./interface";

import { PlacesClient } from "@googlemaps/places";

const client = new PlacesClient({
  apiKey: process.env.GOOGLE_MAPS_PLACES_API_KEY,
});

export async function autocomplete(
  request: AutocompleteRequest,
): Promise<PlacePrediction[]> {
  const [result] = await client.autocompletePlaces(request);
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
  const callOptions = {
    otherArgs: {
      headers: {
        "X-Goog-FieldMask": request.requestedPlaceDetails.join(","),
      },
    },
  };
  const [result] = await client.getPlace(request, callOptions);
  return result;
}
