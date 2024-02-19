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
import { formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({
  initialData,
  courseId
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
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
        Preço
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Editar preço
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className={cn("text-sm mt-2",
        !initialData.price && " text-slate-500 italic"
      )}>
          {initialData.price
            ? formatPrice(initialData.price) 
            : "Sem preço"
          }
        </p>
      ): (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubimit)}
            className="space-y-4 mt-4"
          >
            <FormField 
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01" 
                      disabled={isSubmitting}
                      placeholder="Escolha o preço do seu curso"
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
