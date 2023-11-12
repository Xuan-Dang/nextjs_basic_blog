import { Row, Col, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext, lazy, Suspense } from "react";
import { DataContext } from "@/context/AppProviders";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import createSlug from "../../utils/createSlug";
import { postData } from "@/utils/fetchData";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

const schema = yup.object({
  name: yup.string().required("Vui lòng nhập tên danh mục"),
  url: yup.string().test({
    name: "testPostCategoryName",
    test: (value, ctx) => {
      if (ctx.parent.name && !value)
        ctx.createError({ message: "Url không được để trống" });
      return true;
    },
  }),
  description: yup.string(),
});

function Add({ setNum }) {
  const { state, dispatch } = useContext(DataContext);
  const { imageModal } = state;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      url: "",
      description: "",
    },
  });

  const handleBlur = (e) => {
    if (e.target.name === "name")
      setValue("url", createSlug(e.target.value), { shouldValidate: true });
  };

  const handleCreate = async (data) => {
    try {
      setIsLoading(true);
      const res = await postData(
        "/post-category/create",
        { ...data },
        {
          timeout: 5000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setIsLoading(false);
      reset();
      setNum((prev) => prev + 1);
      setCategoryImage({ _id: "", url: "" });
      dispatch({
        type: "NOTIFY",
        payload: { success: true, message: res.message },
      });
    } catch (err) {
      setIsLoading(false);
      return dispatch({
        type: "NOTIFY",
        payload: {
          success: false,
          message: err.message,
        },
      });
    }
  };

  return (
    <Col xs={12} md={4}>
      <h3 className="fs-5">Thêm tag mới</h3>
      <Form onSubmit={handleSubmit(handleCreate)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Tên tag</Form.Label>
          <Form.Control
            type="text"
            name="name"
            {...register("name")}
            onBlur={handleBlur}
          />
          <Form.Text className="text-danger">{errors.name?.message}</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="url">
          <Form.Label>Url</Form.Label>
          <Form.Control type="text" name="url" {...register("url")} />
          <Form.Text className="text-danger">{errors.url?.message}</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            {...register("description")}
          />
          <Form.Text className="text-danger">
            {errors.description?.message}
          </Form.Text>
        </Form.Group>
        <Button type="submit" variant="dark" className="w-100">
          Tạo tag{" "}
          {isLoading && (
            <Suspense>
              <Spinner animation="grow" size="sm" />
            </Suspense>
          )}
        </Button>
      </Form>
    </Col>
  );
}
export default Add;
