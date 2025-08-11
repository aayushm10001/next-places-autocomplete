"use client";

import { usePlacesApi } from "./api/PlacesApiProvider";
import type {
  AutocompleteRequest,
  PlaceDetails,
  PlaceDetailsRequest,
} from "./api/interface";

import { useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export type UsePlacesAutocompleteProps = {
  autocompleteProps?: Omit<AutocompleteRequest, "input" | "sessionToken">;
  placeDetailsProps: Omit<PlaceDetailsRequest, "name" | "sessionToken">;
  onPlaceDetailsChangeCallback?: (details: PlaceDetails | null) => void;
};

export function usePlacesAutocomplete(props: UsePlacesAutocompleteProps) {
  const api = usePlacesApi();
  const [input, setInput] = useState("");
  const [sessionToken, setSessionToken] = useState<string>(uuidv4());
  const [sessionComplete, setSessionComplete] = useState<boolean>(false);

  // Autocomplete query - excludes sessionToken from key for cross-session caching
  const { data: suggestions = [] } = useQuery({
    queryKey: ["places-autocomplete", input, props.autocompleteProps],
    queryFn: () => {
      if (!input || sessionComplete) return [];
      return api.autocomplete({
        input,
        sessionToken,
        ...props.autocompleteProps,
      } as AutocompleteRequest);
    },
    placeholderData: keepPreviousData,
  });

  const onChange = (value: string) => {
    setInput(value);
    if (sessionComplete) {
      // Last session was completed. Clear user's stale copy of place details.
      props.onPlaceDetailsChangeCallback?.(null);
      setSessionComplete(false);
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
