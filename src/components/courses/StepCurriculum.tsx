"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";
import { ModuleLessons } from "./ModuleLessons";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "./validation";

type Props = {
  form: UseFormReturn<CourseFormValues>;
  modules: UseFieldArrayReturn<CourseFormValues, "modules", "id">["fields"];
  appendModule: (value: { title: string; description: string; lessons: any[] }) => void;
  removeModule: (index: number) => void;
};

export const StepCurriculum = ({ form, modules, appendModule, removeModule }: Props) => (
  <div className="space-y-4">
    {modules.map((module, moduleIndex) => (
      <Card key={module.id} className="bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">
            Module {moduleIndex + 1}: {form.watch(`modules.${moduleIndex}.title`)}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeModule(moduleIndex)}
          >
            <Trash2 className="text-destructive" size={18} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField control={form.control} name={`modules.${moduleIndex}.title`} render={({ field }) => (
            <FormItem>
              <FormLabel>Module Title</FormLabel>
              <FormControl>
                <ShadcnInput placeholder="e.g., Introduction to React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <ModuleLessons moduleIndex={moduleIndex} control={form.control} watch={form.watch} />
        </CardContent>
      </Card>
    ))}
    <Button
      type="button"
      variant="secondary"
      onClick={() => appendModule({ title: "", description: "", lessons: [] })}
    >
      <Plus className="mr-2" size={16} /> Add Module
    </Button>
  </div>
);
