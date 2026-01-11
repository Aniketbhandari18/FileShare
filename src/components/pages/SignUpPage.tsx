"use client";

import { SignUpFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Inbox, Loader2, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { SignUp } from "@/actions/authActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const SignUpPage = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "SENDER",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof SignUpFormSchema>) => {
    startTransition(async () => {
      console.log("Form submitted");
      console.log(values);

      const result = await SignUp(values);

      if (result.success) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Get started with FileShare today</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("SENDER");
                        }}
                        className={`border-2 rounded-xl p-3 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                          field.value === "SENDER" &&
                          "border-blue-400 bg-blue-100"
                        }`}
                      >
                        <Send size={20} className="text-gray-700" />
                        <span className="font-semibold text-gray-700">
                          Sender
                        </span>
                        <p className="text-sm text-gray-700">
                          Create and share files
                        </p>
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          field.onChange("RECEIVER");
                        }}
                        className={`border-2 rounded-xl p-3 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                          field.value === "RECEIVER" &&
                          "border-blue-400 bg-blue-100"
                        }`}
                      >
                        <Inbox size={20} className="text-gray-700" />
                        <span className="font-semibold text-gray-700">
                          Receiver
                        </span>
                        <p className="text-sm text-gray-700">
                          Create and share files
                        </p>
                      </button>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full mb-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-gray-700">Already have an account?</span>
                <Link href="/sign-in" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default SignUpPage;
