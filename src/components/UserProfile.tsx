"use client";

import { Role } from "@/generated/prisma/enums";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Loader2, LogOut } from "lucide-react";
import { SignOut } from "@/actions/authActions";
import { useTransition } from "react";

type Props = {
  name: String;
  email: String;
  role: Role;
};

const UserProfile = ({ name, email, role }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await SignOut();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Image
          src="/userAvatar.png"
          alt="avatar"
          width={33}
          height={33}
          className="bg-gray-300 rounded-full p-1.5"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-70" align="end">
        <DropdownMenuLabel>
          <div>
            <div className="flex items-center gap-2">
              <span>{name}</span>
              <div
                className={`py-0.5 px-2.5 rounded-xl font-normal text-xs ${
                  role === "SENDER"
                    ? "bg-indigo-500/10 text-indigo-600"
                    : "bg-emerald-500/10 text-emerald-600"
                }`}
              >
                <span>{role.toLowerCase()}</span>
              </div>
            </div>
            <span className="font-normal text-gray-500">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-semibold text-gray-700 cursor-pointer"
          onClick={handleSignOut}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-[spin_0.5s_linear_infinite]" />
          ) : (
            <LogOut className="text-gray-700" />
          )}
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserProfile;
