"use client";

import { useMemo, useState } from "react";

import throttle from "lodash.throttle";
import { v4 as uuidv4 } from "uuid";

import { autocomplete, placeDetails } from "@/server/googlemaps";
import type {
  AutocompleteRequest,
  PlaceDetails,
  PlaceDetailsRequest,
  PlacePrediction,
} from "@/server/googlemaps";

export type UsePlacesAutocompleteProps = Omit<
  AutocompleteRequest & PlaceDetailsRequest,
  "input" | "name" | "sessionToken"
> & { throttle_ms?: number };

export function usePlacesAutocomplete(props: UsePlacesAutocompleteProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<PlaceDetails | null>(null);
  const [sessionToken, setSessionToken] = useState<string>(uuidv4());

  // Need to useMemo here, otherwise a new fetchSuggesions will be created
  // every render, which will effectively remove throttling.
  const fetchSuggestions = useMemo(() => {
    const throttle_ms = props.throttle_ms ?? 0;
    return throttle(async (input: string) => {
      const predictions = await autocomplete({
        input,
        sessionToken,
        ...props,
      } as AutocompleteRequest);
      setSuggestions(predictions);
    }, throttle_ms);
  }, [sessionToken, props]);

  const onChange = (value: string) => {
    setInput(value);
    // null-out selectedPlaceDetails as input has changed
    setSelectedPlaceDetails(null);
    if (value === "") {
      setSuggestions([]);
    } else {
      fetchSuggestions(value);
    }
  };

  const onSelect = async (
    place: string,
    autocompleted_input: string,
  ): Promise<void> => {
    const details = await placeDetails({
      name: `${place}`,
      sessionToken,
      ...props,
    });
    setInput(autocompleted_input);
    setSelectedPlaceDetails(details);
    // Current session is complete. Reset session token.
    setSessionToken(uuidv4());
  };

  return {
    input,
    suggestions,
    selectedPlaceDetails,
    onChange,
    onSelect,
  };
}
