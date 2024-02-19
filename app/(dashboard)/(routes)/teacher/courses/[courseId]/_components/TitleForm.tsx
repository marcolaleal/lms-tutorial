"use client"

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O campo 'titulo' é obrigatório",
  }),
});

export const TitleForm = ({
  initialData,
  courseId
}: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
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
        Titulo
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Editar titulo
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className="text-sm mt-2">
          {initialData.title}
        </p>
      ): (
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
                      placeholder="Ex. Desenvolvimento Web"
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
