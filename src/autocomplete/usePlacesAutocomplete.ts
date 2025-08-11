"use client";

import { usePlacesApi } from "./api/PlacesApiProvider";
import type {
  AutocompleteRequest,
  PlaceDetails,
  PlaceDetailsRequest,
  PlacePrediction,
} from "./api/interface";

import { useMemo, useState } from "react";

import throttle from "lodash.throttle";
import { v4 as uuidv4 } from "uuid";

export type UsePlacesAutocompleteProps = {
  autocompleteProps?: Omit<AutocompleteRequest, "input" | "sessionToken">;
  placeDetailsProps: Omit<PlaceDetailsRequest, "name" | "sessionToken">;
  throttle_ms?: number;
  onPlaceDetailsChangeCallback?: (details: PlaceDetails | null) => void;
};

export function usePlacesAutocomplete(props: UsePlacesAutocompleteProps) {
  const api = usePlacesApi();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [sessionToken, setSessionToken] = useState<string>(uuidv4());
  const [sessionComplete, setSessionComplete] = useState<boolean>(false);

  // Need to useMemo here, otherwise a new fetchSuggesions will be created
  // every render, which will effectively remove throttling.
  const fetchSuggestions = useMemo(() => {
    const throttle_ms = props.throttle_ms ?? 0;
    return throttle(async (input: string) => {
      const predictions = await api.autocomplete({
        input,
        sessionToken,
        ...props.autocompleteProps,
      } as AutocompleteRequest);
      setSuggestions(predictions);
    }, throttle_ms);
  }, [sessionToken, props, api]);

  const onChange = (value: string) => {
    setInput(value);
    if (sessionComplete) {
      // Last session was completed. Clear user's stale copy of place details.
      props.onPlaceDetailsChangeCallback?.(null);
      setSessionComplete(false);
    }
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
    const details = await api.placeDetails({
      name: `${place}`,
      sessionToken,
      ...props.placeDetailsProps,
    });
    setInput(autocompleted_input);
    props.onPlaceDetailsChangeCallback?.(details);
    setSessionComplete(true);
    // Set sessionToken for next session
    setSessionToken(uuidv4());
  };

  return {
    input,
    suggestions,
    onChange,
    onSelect,
  };
}
