import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserCreateDTO, UserUpdateDTO } from "@/lib/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema para crear un usuario
const createUserSchema = z.object({
  nickname: z.string().min(3, {
    message: "Nickname must be at least 3 characters.",
  }),
  email: z.email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Schema para actualizar un usuario
const updateUserSchema = z.object({
  id: z.uuid(),

  nickname: z.preprocess(
    (val: string) => (val === "" ? undefined : val),
    z
      .string()
      .min(3, { message: "Nickname must be at least 3 characters." })
      .optional()
  ),
  password: z.preprocess(
    (val: string) => (val === "" ? undefined : val),
    z
      .string()
      .min(6, { message: "Password must be at least 6 characters." })
      .optional()
  ),
});

type UserFormProps = {
  user?: {
    id: string;
    nickname: string;
    email: string;
  };
  onSubmit: (data: UserCreateDTO | UserUpdateDTO) => Promise<void>;
  onCancel: () => void;
};

const formSchema = z.union([createUserSchema, updateUserSchema]);
type FormSchema = z.infer<typeof formSchema>;

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!user;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing
      ? {
          id: user.id,
          nickname: user.nickname || "",
          email: user.email || "",
          password: "",
        }
      : {
          nickname: "",
          email: "",
          password: "",
        },
  });

  // Actualizar valores cuando cambia el usuario a editar
  useEffect(() => {
    if (isEditing && user) {
      // Reset del formulario con los nuevos valores
      form.reset({
        id: user.id,
        nickname: user.nickname || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [form, isEditing, user]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await onSubmit(values as UserUpdateDTO);
      } else {
        await onSubmit(values as UserCreateDTO);
      }
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Enter nickname" {...field} />
              </FormControl>
              <FormDescription>The display name for the user.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={isEditing}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The email address for the account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password {isEditing && "(leave blank to keep current)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isEditing ? "••••••" : "Enter password"}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {isEditing
                  ? "Leave blank to keep the current password."
                  : "Must be at least 6 characters."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
