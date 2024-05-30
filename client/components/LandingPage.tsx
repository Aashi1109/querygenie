"use client";

import React, { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

const LandingPage = () => {
  const { data } = useSession();
  return (
    <section className="landing-page w-full flex-center flex-1 flex-col">
      <h1 className="head_text text-center">
        Discover & Query, <br className="max-md:hidden" />
        <span className="orange_gradient text-center">
          Your pdf knowledge hub
        </span>
      </h1>
      <p className="desc text-center">
        Unlock the Power of Your Documents with Advanced Query Capabilities and
        Insightful Analysis
      </p>

      {!data?.user && (
        <Button
          className={"rounded-full mt-4"}
          onClick={signIn as MouseEventHandler}
        >
          Get started
        </Button>
      )}
    </section>
  );
};

export default LandingPage;
