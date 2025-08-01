import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

type Items = { label: string; value: string }[];

export const Combobox: React.FC<{
  value: string | number;
  items: Items;
  placeholder: string;
  isLoading: boolean;
  search: string;
  disabled?: boolean;
  setValue: (value: string) => void;
  onChange: (value: string) => void;
}> = ({
  value,
  items,
  placeholder,
  isLoading,
  search,
  setValue,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : `Select ${placeholder}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
        <Command className="" shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder}...`}
            className="h-9 w-full"
            value={search}
            onValueChange={(value) => onChange(value)}
          />
          <CommandList className="w-full">
            <CommandEmpty>No {placeholder} found.</CommandEmpty>
            <CommandGroup>
              {isLoading && (
                <CommandItem disabled>
                  <div className="flex items-center justify-center w-full">
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                </CommandItem>
              )}

              {!isLoading &&
                items?.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
