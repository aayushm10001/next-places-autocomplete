"use client";

import * as clientApi from "./api/client";
import type {
  AutocompleteRequest,
  PlaceDetails,
  PlaceDetailsRequest,
} from "./api/client";

import { useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export type UsePlacesAutocompleteProps = {
  initialInput?: string;
  initialSessionComplete?: boolean;
  autocompleteProps?: Omit<AutocompleteRequest, "input" | "sessionToken">;
  placeDetailsProps: Omit<PlaceDetailsRequest, "name" | "sessionToken">;
  onPlaceDetailsChangeCallback?: (
    details: PlaceDetails | null,
    autocompletedInput?: string,
  ) => void;
};

export function usePlacesAutocomplete(props: UsePlacesAutocompleteProps) {
  const [input, setInput] = useState(props.initialInput ?? "");
  const [sessionToken, setSessionToken] = useState<string>(() => uuidv4());
  const [sessionComplete, setSessionComplete] = useState<boolean>(
    props.initialSessionComplete ?? false,
  );

  // Autocomplete query - excludes sessionToken from key for cross-session caching
  const { data: suggestions = [] } = useQuery({
    queryKey: ["places-autocomplete", input, props.autocompleteProps],
    queryFn: () => {
      if (!input || sessionComplete) return [];
      return clientApi.autocomplete({
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
      props.onPlaceDetailsChangeCallback?.(null, value);
      setSessionComplete(false);
    }
  };

  const onSelect = async (
    place: string,
    autocompleted_input: string,
  ): Promise<void> => {
    const details = await clientApi.placeDetails({
      name: `${place}`,
      sessionToken,
      ...props.placeDetailsProps,
    });
    setInput(autocompleted_input);
    props.onPlaceDetailsChangeCallback?.(details, autocompleted_input);
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
