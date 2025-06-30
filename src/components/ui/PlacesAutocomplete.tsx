"use client";

import { useEffect, useState } from "react";

import {
  PlaceDetails,
  UsePlacesAutocompleteProps,
  usePlacesAutocomplete,
} from "@aayush10001/next-places-autocomplete-headless";

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

type PlacesAutocompleteComponentSpecificProps = {
  placeholder?: string;
  className?: string;
  id?: string;
};
export type PlacesAutocompleteProps = UsePlacesAutocompleteProps &
  PlacesAutocompleteComponentSpecificProps;

export function PlacesAutocomplete(props: PlacesAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const { input, suggestions, onChange, onSelect } =
    usePlacesAutocomplete(props);

  const shouldShowPopover = open && suggestions.length > 0;
  const placeholder = props.placeholder ?? "Search for a place...";

  return (
    <Popover open={shouldShowPopover}>
      <PopoverAnchor asChild>
        <Input
          id={props.id}
          value={input}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          autoComplete="off"
          className={props.className}
        />
      </PopoverAnchor>
      <PopoverContent
        className="p-0"
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
