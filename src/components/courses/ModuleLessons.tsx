"use client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Control, UseFormWatch, useFieldArray } from "react-hook-form";
import { CourseFormValues } from "./validation";

type ModuleLessonsProps = {
  moduleIndex: number;
  control: Control<CourseFormValues>;
  watch: UseFormWatch<CourseFormValues>;
};

export const ModuleLessons = ({ moduleIndex, control, watch }: ModuleLessonsProps) => {
  const { fields: lessons, append, remove } = useFieldArray({ control, name: `modules.${moduleIndex}.lessons` });

  return (
    <div className="pl-4 border-l-2">
      <h4 className="font-semibold mb-2">Lessons</h4>
      {lessons.map((lesson, lessonIndex) => (
        <Accordion key={lesson.id} type="single" collapsible className="w-full">
          <AccordionItem value={`item-${lessonIndex}`}>
            <AccordionTrigger>
              Lesson {lessonIndex + 1}: {watch(`modules.${moduleIndex}.lessons.${lessonIndex}.title`) || "New Lesson"}
            </AccordionTrigger>
            <AccordionContent className="space-y-3 bg-background p-4 rounded">
              <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl><ShadcnInput placeholder="e.g., Setting up your project" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name={`modules.${moduleIndex}.lessons.${lessonIndex}.video_link`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl><ShadcnInput placeholder="https://youtube.com/watch?v=..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="text-right">
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(lessonIndex)}>Remove Lesson</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ title: "", video_link: "" })}>
        <Plus className="mr-2" size={16} /> Add Lesson
      </Button>
    </div>
  );
};
