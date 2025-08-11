"use client";

import { useState } from "react";

import {
  PlaceDetails,
  PlacesApiProvider,
  placeDetailsEssentialsFields,
} from "@aayush10001/next-places-autocomplete-headless";

import { PlacesAutocomplete } from "@/components/ui/PlacesAutocomplete";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [details, setDetails] = useState<PlaceDetails | null>(null);

  return (
    <div className="flex justify-center pt-10 px-4">
      <main className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Next Places Autocomplete
        </h1>

        <div className="flex justify-center w-full">
          <div className="flex flex-row w-full max-w-md items-center gap-2">
            <Label htmlFor="places">Label:</Label>
            <PlacesApiProvider implementation="client">
              <PlacesAutocomplete
                onPlaceDetailsChangeCallback={(selectedDetails) => {
                  setDetails(selectedDetails);
                }}
                placeDetailsProps={{
                  requestedPlaceDetails: placeDetailsEssentialsFields,
                }}
                autocompleteProps={{
                  includedPrimaryTypes: ["(regions)"],
                }}
                // throttle_ms={400}
                id="places"
              />
            </PlacesApiProvider>
          </div>
        </div>

        {details && (
          <>
            <h2 className="font-medium mb-2">Place Details</h2>
            <div className="border p-4 rounded bg-gray-50 text-sm overflow-auto break-words max-h-96">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
