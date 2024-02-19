"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chapter, Course } from "@prisma/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChaptersList } from "./ChaptersList";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[]};
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({
  initialData,
  courseId
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => setIsCreating((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubimit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Modulo criado com sucesso")
      toggleCreating();

      router.refresh();
    } catch {
      toast.error("Algo deu errado...");
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      });
      toast.success("Módulos reordenados com sucesso")

      router.refresh();
    } catch {
      toast.error("Algo deu errado...");
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className=" relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2  className="h-6 w-6 animate-spin text-sky-700"/>
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Aulas
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancelar</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add Aula
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubimit)}
            className="space-y-4 mt-4"
          >
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="Ex. 'Introdução'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Criar
            </Button>         
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.chapters.length && "text-slate-500 italic"
        )}>
          {!initialData.chapters.length && "Sem aulas..."}
          <ChaptersList 
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Arraste e solte para ordenar as aulas
        </p>
      )}
    </div>
  )
}
