"use client";

import * as clientApi from "./client";
import type { PlacesApi, PlacesApiImplementation } from "./interface";
import * as serverApi from "./server";

import React, { createContext, useContext, useMemo } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PlacesApiContext = createContext<PlacesApi | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: "static",
      gcTime: 30 * 60 * 1000,
    },
  },
});

export interface PlacesApiProviderProps {
  implementation: PlacesApiImplementation;
  children: React.ReactNode;
}

export function PlacesApiProvider({
  implementation,
  children,
}: PlacesApiProviderProps) {
  const api = useMemo(() => {
    switch (implementation) {
      case "client":
        return {
          autocomplete: clientApi.autocomplete,
          placeDetails: clientApi.placeDetails,
        };
      case "server":
        return {
          autocomplete: serverApi.autocomplete,
          placeDetails: serverApi.placeDetails,
        };
      default:
        throw new Error(`Unknown API implementation: ${implementation}`);
    }
  }, [implementation]);

  return (
    <QueryClientProvider client={queryClient}>
      <PlacesApiContext.Provider value={api}>
        {children}
      </PlacesApiContext.Provider>
    </QueryClientProvider>
  );
}

export function usePlacesApi(): PlacesApi {
  const api = useContext(PlacesApiContext);

  if (!api) {
    throw new Error(
      "usePlacesApi must be used within a PlacesApiProvider. " +
        'Wrap your component with <PlacesApiProvider implementation="client|server">...',
    );
  }

  return api;
}
