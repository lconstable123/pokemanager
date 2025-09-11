// ImportRadioDropdown.tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";

const importOptions = [
  { value: "csv", label: "CSV File" },
  { value: "json", label: "JSON File" },
  { value: "xml", label: "XML File" },
];

export default function ImportDropdown() {
  const [selected, setSelected] = useState("csv");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Import: {importOptions.find((o) => o.value === selected)?.label}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white rounded shadow-md p-3 w-48"
          sideOffset={5}
        >
          <RadioGroup.Root
            className="flex flex-col gap-2"
            value={selected}
            onValueChange={setSelected}
          >
            {importOptions.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                  <RadioGroup.Indicator className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
                <span className="text-gray-800 text-sm">{option.label}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
