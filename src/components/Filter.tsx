"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between gap-6">
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-2">
          <Input
            id="min"
            name="min"
            placeholder="Min price"
            className="w-24"
            onChange={(e) => handleFilterChange("min", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id="max"
            name="max"
            placeholder="Max price"
            className="w-24"
            onChange={(e) => handleFilterChange("max", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Select
            onValueChange={(value) => handleFilterChange("filter", value)}
          >
            <SelectTrigger id="filters" className="w-[180px]">
              <SelectValue placeholder="Filters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="New Arrival">New Arrivals</SelectItem>
              <SelectItem value="Sale">On Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Select onValueChange={(value) => handleFilterChange("sort", value)}>
          <SelectTrigger id="sort" className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="asc price">Price (low to high)</SelectItem>
            <SelectItem value="desc price">Price (high to low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;
