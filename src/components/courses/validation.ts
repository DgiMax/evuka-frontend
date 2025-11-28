import * as z from "zod";

export const courseFormSchema = z.object({
  title: z.string().min(5).max(100),
  short_description: z.string().min(10).max(200),
  long_description: z.string().min(50),
  learning_objectives: z.array(z.object({ value: z.string().min(10) })).min(2),
  organization: z.string().optional(),
  global_category: z.string().min(1),
  global_level: z.string().min(1),
  org_category: z.string().optional(),
  org_level: z.string().optional(),
  thumbnail: z.any().optional(),
  promo_video: z.string().url().optional().or(z.literal("")),
  price: z.coerce.number().positive(),
  is_published: z.boolean().default(false),
  modules: z
    .array(
      z.object({
        title: z.string().min(3),
        description: z.string().optional(),
        lessons: z.array(
          z.object({
            title: z.string().min(3),
            video_link: z.string().url().optional().or(z.literal("")),
          })
        ),
      })
    )
    .min(1),
}).superRefine((data, ctx) => {
  if (data.organization) {
    if (!data.org_category) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Organization category is required.", path: ["org_category"] });
    }
    if (!data.org_level) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Organization level is required.", path: ["org_level"] });
    }
  }
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
