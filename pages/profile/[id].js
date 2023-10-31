import Layout from "@/components/Layout";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "@/context/AppProviders";
import { useRouter } from "next/router";
import Head from "next/head";

function Profile() {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("is_login")) {
      const isLogin = JSON.parse(localStorage.getItem("is_login"));
      if (!isLogin) router.push("/login");
    } else {
      router.push("/login");
    }
  }, []);
  
  return (
    <Layout>
      <Head>
        <title>{`${user.fullName} - Profile`}</title>
      </Head>
      Profile
    </Layout>
  );
}
export default Profile;
