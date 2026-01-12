"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { SignOut } from "@/actions/authActions";

const HomePage = () => {
  const handleSignOut = async () => {
    await SignOut();
  };

  return (
    <div>
      <Button>
        <Link href="/sign-up">Sign up</Link>
      </Button>
      <Button>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};
export default HomePage;
