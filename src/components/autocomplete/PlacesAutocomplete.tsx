"use client";

import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { PlaceDetails } from "./server";
import {
  UsePlacesAutocompleteProps,
  usePlacesAutocomplete,
} from "./usePlacesAutocomplete";

import { useEffect, useState } from "react";

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
        <div className="relative w-full">
          <Input
            value={input}
            placeholder={placeholder}
            onChange={(e) => {
              props.onSelectCallback(null);
              onChange(e.target.value);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className={props.className}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="relative p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
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
                  style={{ height: "var(--radix-popover-trigger-height)" }}
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
