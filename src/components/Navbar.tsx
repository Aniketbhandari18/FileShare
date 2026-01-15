import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import UserProfile from "./UserProfile";
import prisma from "@/lib/prisma";
import { Share2 } from "lucide-react";

const Navbar = async () => {
  const { userId } = await auth();

  const user =
    userId &&
    (await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full mx-auto px-4 sm:px-6 lg:px-6 bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center h-14">
        <Link href="/">
          <div
            className={`flex items-center justify-between gap-1 text-xl font-bold `}
          >
            <Share2 fill="black" size={20} />
            <span>FileShare</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {userId && user ? (
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  color="grey"
                  className="hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Dashboard
                </Button>
              </Link>
              <UserProfile
                name={user.name}
                email={user.email}
                role={user.role}
              />
            </div>
          ) : (
            <div className="space-x-2">
              <Button variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
