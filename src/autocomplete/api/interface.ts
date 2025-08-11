import type { protos } from "@googlemaps/places";

export type AutocompleteRequest =
  protos.google.maps.places.v1.IAutocompletePlacesRequest;
export type PlaceDetailsRequest =
  protos.google.maps.places.v1.IGetPlaceRequest & {
    requestedPlaceDetails: string[];
  };
export type PlacePrediction =
  protos.google.maps.places.v1.AutocompletePlacesResponse.Suggestion.IPlacePrediction;
export type PlaceDetails = protos.google.maps.places.v1.IPlace;

// Abstract interface that both client and server implementations must follow
export interface PlacesApi {
  autocomplete(request: AutocompleteRequest): Promise<PlacePrediction[]>;
  placeDetails(request: PlaceDetailsRequest): Promise<PlaceDetails>;
}

// Implementation types
export type PlacesApiImplementation = "client" | "server";
