import { DialogType, Todo } from "@/App";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
});

export type TodoFormInputs = Pick<Todo, "name" | "description">;

export type FormType = "create" | "edit";
export type TodoFormProps = {
  type: FormType;
  data?: Todo;
  isDialogOpen: boolean;
  setIsDialogOpen: (data: DialogType) => void;
  submitHandler: (data: TodoFormInputs) => void;
};
const TodoForm = ({
  type = "create",
  data,
  isDialogOpen,
  setIsDialogOpen,
  submitHandler,
}: TodoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });
  const { handleSubmit, reset } = form;
  const onSubmit: SubmitHandler<TodoFormInputs> = (data) => {
    submitHandler(data);
    setIsDialogOpen({ type, isOpen: false });
    reset();
  };
  const formTitle = type === "create" ? "Create Todo" : "Edit Todo";
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(e) => setIsDialogOpen({ type: type, isOpen: e })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="ex. Deni" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="ex. working" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              {type === "create" ? "Submit" : "Update"}
            </Button>
            {/* <div className="grid gap-4 py-4">
            <Input
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              type="text"
              name="name"
              placeholder="Todo name"
              className="w-full"
            />
            <Input
              type="text"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              name="description"
              placeholder="Todo description"
              className="w-full"
            />
          </div> */}
            {/* <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter> */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
