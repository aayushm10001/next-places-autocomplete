"use client";

import { PlaceDetails } from "./server";
import {
  UsePlacesAutocompleteProps,
  usePlacesAutocomplete,
} from "./usePlacesAutocomplete";

import { useEffect, useState } from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PlacesAutocompleteComponentSpecificProps = {
  onSelectCallback: (details: PlaceDetails | null) => void;
  placeholder?: string;
  className?: string;
};
export type PlacesAutocompleteProps = UsePlacesAutocompleteProps &
  PlacesAutocompleteComponentSpecificProps;

export function PlacesAutocomplete(props: PlacesAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const { input, suggestions, selectedPlaceDetails, onChange, onSelect } =
    usePlacesAutocomplete(props);

  // Notify selection change to user
  const onSelectCallback = props.onSelectCallback;
  useEffect(() => {
    onSelectCallback(selectedPlaceDetails);
  }, [onSelectCallback, selectedPlaceDetails]);

  const shouldShowPopover = open && suggestions.length > 0;
  const placeholder = props.placeholder ?? "Search for a place...";

  return (
    <Popover open={shouldShowPopover}>
      <PopoverAnchor asChild>
        <div className="relative w-[300px]">
          <Input
            value={input}
            placeholder={placeholder}
            onChange={(e) => {
              props.onSelectCallback(null);
              onChange(e.target.value);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className={cn("h-10", props.className)}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[300px] p-0 shadow-md border rounded-md z-50"
        side="bottom"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandGroup>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.place!}
                  value={suggestion.place!}
                  onSelect={async () => {
                    setOpen(false);
                    await onSelect(suggestion.place!, suggestion.text!.text!);
                  }}
                >
                  {suggestion.text!.text!}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
