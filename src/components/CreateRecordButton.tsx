"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { createRecordFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FileCategory } from "@/generated/prisma/enums";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CreateRecordButton = () => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof createRecordFormSchema>>({
    resolver: zodResolver(createRecordFormSchema),
    defaultValues: {
      fileName: "",
      fileDescription: "",
      category: "OTHER",
    },
    mode: "onChange",
  });

  const { isValid, isDirty } = form.formState;
  const uploadButtonDisabled = !isValid || !isDirty;

  const handleOpenChange = () => {
    setOpen(!open);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>New Record</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Record</DialogTitle>
          <DialogDescription>
            Create a new record by uploading a file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4">
            {/* File Name */}
            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <div className="flex relative">
                      <Input
                        placeholder="File name (without ext.)"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Description */}
            <FormField
              control={form.control}
              name="fileDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the file..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select defaultValue="OTHER" onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Category"
                          className="font-semibold"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {Object.values(FileCategory).map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="font-semibold"
                            >
                              {category[0].toUpperCase() +
                                category.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="mt-4">
          <UploadButton
            endpoint="recordUploader"
            input={{ values: form.getValues() }}
            disabled={uploadButtonDisabled}
            appearance={{
              button: `w-full flex items-center justify-center gap-2 ${uploadButtonDisabled ? "bg-black/75!" : "bg-black!"}`,
            }}
            onClientUploadComplete={() => {
              handleOpenChange();
              toast.success("Record created successfully");
              router.refresh();
            }}
            onUploadError={(error: Error) => {
              toast.error(error.message);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreateRecordButton;
