"use client";

import { useState } from "react";

import {
  UsePlacesAutocompleteProps,
  usePlacesAutocomplete,
} from "@aayush10001/next-places-autocomplete-headless";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

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
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            className={cn("pl-8", props.className)}
          />
        </div>
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
