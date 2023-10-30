import Layout from "@/components/Layout";
import Head from "next/head";
import { getData } from "@/utils/fetchData";
import { useEffect, useState, useContext } from "react";

function Product({products, error}) {
  useEffect(() => {
    console.log(products)
    console.log(error)
  }, [])
  return (
    <Layout>
      <Head>
        <title>Sản phẩm</title>
      </Head>
      <p>Product</p>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await getData("/product/get-product", {
      timeout: 3600,
    });
    console.log("res: ", res.products);
    const products = res.products;
    return {
      props: { products: products },
    };
  } catch (err) {
    console.log("err: ", err.message);
    return {
      props: { error: err ? err : null },
    };
  }
}
export default Product;
