"use client";

import {
  Ban,
  Download,
  Eye,
  Link2,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Record, Role } from "@/generated/prisma/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { deleteRecord, revokeAccess } from "@/actions/recordActions";
import { useState } from "react";

type Props = {
  role: Role;
  record: Record;
};

type LoadingAction = "revoke" | "delete" | "download" | null;

const ActionsDialogMenu = ({ role, record }: Props) => {
  const [open, setOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const isLoading = loadingAction !== null;

  const fileUrl = record.fileUrl; // this is temp, till i implement my own file view page.

  const isExpired = record.expiresAt < new Date();
  const isRevoked = record.isRevoked;
  const isInactive = isExpired || isRevoked;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fileUrl);
    toast.success("File link has been copied to clipboard");
  };

  // will implement later
  const handleDownload = () => {
    console.log("downloading...");
  };

  const handleRevoke = async () => {
    setLoadingAction("revoke");

    const res = await revokeAccess(record.id);

    if (res.success) {
      toast.success("File access revoked successfully");
    } else {
      toast.error(res.error || "Something went wrong");
    }

    setOpen(false);
    setLoadingAction(null);
  };

  const handleDelete = async () => {
    setLoadingAction("delete");

    const res = await deleteRecord(record.id);

    if (res.success) {
      toast.success("File deleted successfully");
    } else {
      toast.error(res.error || "Something went wrong");
    }

    setOpen(false);
    setLoadingAction(null);
  };

  const handleOpenChange = () => {
    setOpen(!open);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant={"ghost"} className="hover:bg-black/10">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-42"
        align="end"
        onPointerDownOutside={(e) => {
          if (isLoading) {
            e.preventDefault();
          }
        }}
      >
        {/* Copy Link */}
        <DropdownMenuItem
          onClick={() => handleCopyLink()}
          disabled={isInactive || isLoading}
        >
          <Link2 className="h-4 w-4" />
          Copy link
        </DropdownMenuItem>

        {/* Preview File */}
        <DropdownMenuItem disabled={isInactive || isLoading} asChild>
          <Link href={fileUrl}>
            <Eye className="h-4 w-4" />
            Preview
          </Link>
        </DropdownMenuItem>

        {/* Download File */}
        <DropdownMenuItem
          onClick={() => handleDownload()}
          disabled={isInactive || isLoading}
        >
          <Download className="h-4 w-4" />
          Download
        </DropdownMenuItem>

        {/* Sender-only actions */}
        {role === "SENDER" && (
          <>
            <DropdownMenuSeparator />

            {/* Revoke File Access */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isInactive || isLoading}
              className="text-yellow-600 focus:text-warning"
            >
              {loadingAction === "revoke" ? (
                <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
              ) : (
                <Ban className="h-4 w-4 text-yellow-600" />
              )}
              Revoke access
            </DropdownMenuItem>

            {/* Delete File */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isLoading}
              className="text-destructive focus:text-destructive"
            >
              {loadingAction === "delete" ? (
                <Loader2 className="w-4 h-4 animate-spin text-destructive" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ActionsDialogMenu;
