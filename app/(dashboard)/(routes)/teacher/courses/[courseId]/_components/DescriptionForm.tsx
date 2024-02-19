"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(2, {
    message: "O campo 'descrição' é obrigatório",
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubimit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Curso atualizado com sucesso!")
      toggleEdit();

      router.refresh();
    } catch {
      toast.error("Algo deu errado...");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Descrição
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Editar descrição
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className={cn("text-sm mt-2",
        !initialData.description && " text-slate-500 italic"
      )}>
          {initialData.description || "Sem descrição"}
        </p>
      ): (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubimit)}
            className="space-y-4 mt-4"
          >
            <FormField 
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      disabled={isSubmitting}
                      placeholder="Ex. 'este curso é sobre...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
