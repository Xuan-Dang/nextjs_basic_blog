import Layout from "@/components/Layout";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

function Profile() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("is_login")) {
      const isLogin = JSON.parse(localStorage.getItem("is_login"));
      if (!isLogin) router.push("/login");
    } else {
      router.push("/login");
    }
  }, []);
  return <Layout>Profile</Layout>;
}
export default Profile;
