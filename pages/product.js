import Layout from "@/components/Layout";
import Head from "next/head";
import { getData } from "@/utils/fetchData";
import { useEffect, useState, useContext } from "react";
import { Row } from "react-bootstrap";
import ProductItem from "@/components/product/ProductItem";

function Product({ products, error }) {
  return (
    <Layout>
      {error && (
        <>
          <Head>
            <title>{error.message}</title>
          </Head>
          <div>{error.message}</div>
        </>
      )}
      <Head>
        <title>Sản phẩm</title>
      </Head>
      <Row>
        {products.map((product) => {
          return <ProductItem key={product._id} productItem={product} />;
        })}
      </Row>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await getData("/product/get-product", {
      timeout: 3600,
    });
    const products = res.products;
    return {
      props: { products: products },
    };
  } catch (err) {
    return {
      props: { error: err ? err : null },
    };
  }
}
export default Product;
