"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseFormValues } from "./validation";
import { DUMMY_DATA } from "./constants";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<CourseFormValues>;
  tutorType: "organization" | "independent";
  appendObjective: (value: { value: string }) => void;
  removeObjective: (index: number) => void;
  objectives: UseFieldArrayReturn<CourseFormValues, "learning_objectives", "id">["fields"];
  selectedOrg: string | undefined;
};

export const StepBasicInfo = ({
  form,
  tutorType,
  appendObjective,
  removeObjective,
  objectives,
  selectedOrg,
}: Props) => {
  return (
    <div className="space-y-6">
      {/* Course Title */}
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem>
          <FormLabel>Course Title</FormLabel>
          <FormControl>
            <ShadcnInput placeholder="e.g., The Ultimate Next.js Bootcamp" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      {/* Short Description */}
      <FormField control={form.control} name="short_description" render={({ field }) => (
        <FormItem>
          <FormLabel>Short Description</FormLabel>
          <FormControl>
            <Textarea placeholder="A brief, catchy summary of your course." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      {/* Full Description */}
      <FormField control={form.control} name="long_description" render={({ field }) => (
        <FormItem>
          <FormLabel>Full Course Description</FormLabel>
          <FormControl>
            <Textarea rows={6} placeholder="Use markdown for rich text..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      {/* Learning Objectives */}
      <div>
        <FormLabel>Learning Objectives</FormLabel>
        {objectives.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`learning_objectives.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mt-2">
                <FormControl>
                  <ShadcnInput placeholder={`Objective #${index + 1}`} {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeObjective(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </FormItem>
            )}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => appendObjective({ value: "" })}
        >
          <Plus className="mr-2" size={16} /> Add Objective
        </Button>
        <FormMessage>{form.formState.errors.learning_objectives?.message}</FormMessage>
      </div>

      {/* Organization & Category Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        {tutorType === "organization" && (
          <FormField control={form.control} name="organization" render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DUMMY_DATA.organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        )}

        <FormField control={form.control} name="global_category" render={({ field }) => (
          <FormItem>
            <FormLabel>Global Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DUMMY_DATA.globalCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="global_level" render={({ field }) => (
          <FormItem>
            <FormLabel>Global Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DUMMY_DATA.globalLevels.map((lvl) => (
                  <SelectItem key={lvl.id} value={lvl.id}>
                    {lvl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {tutorType === "organization" && selectedOrg && (
          <>
            <FormField control={form.control} name="org_category" render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select org category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DUMMY_DATA.orgCategories[selectedOrg]?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="org_level" render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select org level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DUMMY_DATA.orgLevels[selectedOrg]?.map((lvl) => (
                      <SelectItem key={lvl.id} value={lvl.id}>
                        {lvl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </>
        )}
      </div>
    </div>
  );
};
