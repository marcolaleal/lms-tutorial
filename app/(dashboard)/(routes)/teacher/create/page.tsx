"use client";

import * as z from "zod";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Título é obrigatório"
  }),

})

const CreatePage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title:""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Curso criado com sucesso!");
    } catch {
      toast.error("Algo deu errado...")
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Nome do curso
        </h1>
        <p className="text-sm text-slate-600">
          Qual o nome do seu curso? Não se preocupe, voçê poderá alterar o nome depois
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome do curso
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="Engenharia de dados..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    O que voçê quer ensinar nesse curso?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
                <Link href="/">
                  <Button
                    type="button"
                    variant="ghost"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Continue
                </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage;