"use client";

import { useState } from "react";

import {
  PlaceDetails,
  PlacesAutocomplete,
  placeDetailsEssentialsFields,
} from "@/components/autocomplete";

export default function Page() {
  const [details, setDetails] = useState<PlaceDetails | null>(null);

  return (
    <div className="flex justify-center pt-10 px-4">
      <main className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Next Places Autocomplete
        </h1>

        <div className="flex justify-center">
          <PlacesAutocomplete
            onSelectCallback={(selectedDetails) => {
              setDetails(selectedDetails);
            }}
            requestedPlaceDetails={placeDetailsEssentialsFields}
            includedPrimaryTypes={["(regions)"]}
            throttle_ms={400}
          />
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
