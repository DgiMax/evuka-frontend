"use client";

import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "./validation";

type Props = {
  form: UseFormReturn<CourseFormValues>;
};

export const StepMediaResources = ({ form }: Props) => (
  <div className="space-y-6">
    <FormField control={form.control} name="thumbnail" render={({ field }) => (
      <FormItem>
        <FormLabel>Course Thumbnail</FormLabel>
        <FormControl>
          <ShadcnInput
            type="file"
            accept="image/*"
            onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
    <FormField control={form.control} name="promo_video" render={({ field }) => (
      <FormItem>
        <FormLabel>Promotional Video URL</FormLabel>
        <FormControl>
          <ShadcnInput placeholder="https://vimeo.com/your-video-id" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  </div>
);
