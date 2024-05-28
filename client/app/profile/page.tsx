"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useSearchParams } from "next/navigation";
import Profile from "@/components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const [profData, setProfData] = useState([]);
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(
        `/api/users/${userId ?? session?.user?.id}/posts`,
      );
      const respData = await resp.json();

      setProfData(respData);
    };
    if (session?.user?.id || userId) fetchData();
  }, []);
  useEffect(() => {
    const getUserData = async () => {
      const resp = await fetch(`/api/users/${userId}`);
      const respData = await resp.json();
      setUserData(respData);
    };
    if (userId) getUserData();
  }, []);
  return (
    <Profile
      name={
        userData && session?.user?.id !== userData._id
          ? `${userData?.username}'s`
          : "My"
      }
      desc={
        userData?.username && session?.user?.id !== userData._id
          ? "Dive into mesmerizing profile with thought-provoking prompts and unleash your imagination using them."
          : "Welcome to my profile page"
      }
      data={profData}
    />
  );
};

export default MyProfile;
