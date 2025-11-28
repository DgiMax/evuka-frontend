"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "./validation";

type Props = {
  form: UseFormReturn<CourseFormValues>;
};

export const StepPricingPublish = ({ form }: Props) => (
  <div className="space-y-6">
    <FormField control={form.control} name="price" render={({ field }) => (
      <FormItem>
        <FormLabel>Price (USD)</FormLabel>
        <FormControl>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <ShadcnInput type="number" step="0.01" placeholder="e.g., 49.99" className="pl-8" {...field} />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />

    <FormField control={form.control} name="is_published" render={({ field }) => (
      <FormItem className="flex flex-row items-center justify-between rounded border p-4">
        <div className="space-y-0.5">
          <FormLabel className="text-base">Publish Course</FormLabel>
          <FormDescription>
            Make this course visible to students immediately.
          </FormDescription>
        </div>
        <FormControl>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
      </FormItem>
    )} />
  </div>
);
