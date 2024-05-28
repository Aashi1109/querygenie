"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { Button } from "@/components/ui/button";
import ToggleTheme from "@/components/ToggleTheme";
import { useTheme } from "next-themes";
import CreateProjectActionModal from "@/components/CreateProjectActionDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import FallbackAvatar from "@/components/FallbackAvatar";
import UserProfileSheet from "@/components/UserProfileSheet";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const Nav = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const isProjectsPage = pathname === "/projects";
  const isChatsPage = pathname === "/chats";

  useEffect(() => {
    const providersSet = async () => {
      const resp = await getProviders();
      // console.log(resp);
      setProviders(resp);
    };

    providersSet();
  }, []);

  useEffect(() => {
    // if (session) {
    //   // route to projects
    //   // if (pathname === "/projects" || pathname === "/") {
    //   router.replace(`/projects?userId=${session?.user?.id}`);
    //   // }
    // } else {
    //   // route to login
    //   router.replace("/");
    // }
    if (!session?.user) router.replace("/");
  }, [session, router]);

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <div className={"flex-center"}>
        {!isProjectsPage && session?.user && (
          <TooltipWrapper tooltipText={"Back to projects"}>
            <Link
              href={`/projects?userId=${session?.user?.id}`}
              className={"block sm:hidden"}
            >
              <ChevronLeft className={"w-7 h-7"} />
            </Link>
          </TooltipWrapper>
        )}
        <Link className="flex gap-2 flex-center" href={"/"}>
          <FallbackAvatar
            imagePath={`/assets/images/logo-${theme === "dark" ? "light" : "dark"}.png`}
            size={30}
            fallbackText={"QG"}
            altText={"QueryGenie"}
            classes={"p-1 object-contain text-foreground"}
          />

          <p className="logo_text">QueryGenie</p>
        </Link>
      </div>
      {/* desktop navigation */}
      <div className="sm:flex gap-3 hidden items-center">
        {!isProjectsPage && session?.user && (
          <Link
            href={`/projects?userId=${session?.user?.id}`}
            className={"underline"}
          >
            Projects
          </Link>
        )}
        <ToggleTheme />

        {session?.user ? (
          <div className="flex gap-3 md:gap-5 items-center">
            {/*<Link href="/create-project" className="black_btn">*/}
            {/*  Create Project*/}
            {/*</Link>*/}
            <CreateProjectActionModal />
            <Button className="rounded-full" type="button" onClick={signOut}>
              Signout
            </Button>
            <UserProfileSheet
              user={session.user}
              triggerAsChild={false}
              trigger={
                <TooltipWrapper tooltipText={session.user.name || "User"}>
                  <FallbackAvatar
                    imagePath={session.user.image ?? ""}
                    altText={"profile"}
                    size={30}
                    fallbackText={session.user.name || ""}
                    classes={"cursor-pointer"}
                  />
                </TooltipWrapper>
              }
            />
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <Button
                  className="rounded-full"
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                >
                  Sign in
                </Button>
              ))}
          </>
        )}
      </div>

      {/* mobile navigation */}
      <div className="sm:hidden flex gap-3 relative">
        <ToggleTheme />

        {session?.user ? (
          <div className="flex">
            <div
              onClick={() => setToggleDropdown((prev) => !prev)}
              className={"cursor-pointer"}
            >
              <TooltipWrapper tooltipText={session.user.name || "User"}>
                <FallbackAvatar
                  imagePath={session.user.image ?? ""}
                  size={37}
                  fallbackText={session.user.name ?? "QG"}
                  altText={"profile"}
                />
              </TooltipWrapper>
            </div>

            {toggleDropdown && (
              <div className="dropdown">
                <div
                  className="dropdown_link text-foreground"
                  onClick={() => {
                    // setTimeout(() => {
                    //   setToggleDropdown(false);
                    // }, 1000);
                  }}
                >
                  <UserProfileSheet
                    user={session.user}
                    trigger={<div>My profile </div>}
                    triggerAsChild={true}
                  />
                </div>

                <CreateProjectActionModal />

                <Button
                  type="button"
                  className="mt-0 sm:mt-5 rounded-full"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => {
                return (
                  <Button
                    className="rounded-full"
                    type="button"
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                  >
                    Sign in
                  </Button>
                );
              })}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
