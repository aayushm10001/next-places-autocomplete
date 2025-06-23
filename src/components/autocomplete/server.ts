"use server";

import { PlacesClient } from "@googlemaps/places";
import type { protos } from "@googlemaps/places";

const client = new PlacesClient({ apiKey: process.env.MAPS_API });

export type AutocompleteRequest =
  protos.google.maps.places.v1.IAutocompletePlacesRequest;
export type PlacePrediction =
  protos.google.maps.places.v1.AutocompletePlacesResponse.Suggestion.IPlacePrediction;

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

export type PlaceDetailsRequest =
  protos.google.maps.places.v1.IGetPlaceRequest & {
    requestedPlaceDetails: string[];
  };
export type PlaceDetails = protos.google.maps.places.v1.IPlace;

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
