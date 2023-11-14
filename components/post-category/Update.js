import { Row, Col, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext, lazy, Suspense } from "react";
import Image from "next/image";
import { DataContext } from "@/context/AppProviders";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import createSlug from "../../utils/createSlug";
import { putData } from "@/utils/fetchData";
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

function Update({ setNum, category, isUpdate, setIsUpdate }) {
  const { state, dispatch } = useContext(DataContext);
  const [categoryImage, setCategoryImage] = useState({ _id: "", url: "" });
  const [isLoading, setIsLoading] = useState(false);

  const openImageModal = () => {
    dispatch({
      type: "IMAGE_MODAL",
      payload: {
        show: true,
        cb: (image) => setCategoryImage(() => ({ ...image })),
        type: "CATEGORY_IMAGE",
      },
    });
  };

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

  const handleChange = (e) => {
    if (e.target.name === "name")
      setValue("url", createSlug(e.target.value), { shouldValidate: true });
  };

  const handleUpdate = async (data, id) => {
    try {
      setIsLoading(true);
      const res = await putData(
        `/post-category/update/${category._id}`,
        { ...data, image: categoryImage._id },
        {
          timeout: 5000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setIsLoading(false);
      reset();
      setIsUpdate(false);
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

  useEffect(() => {
    if (isUpdate && Object.keys(category).length > 0) {
      Object.keys(category).forEach((key) =>
        setValue(key, category[key], { shouldValidate: true })
      );
      setCategoryImage({ ...category.image });
    }
  }, [isUpdate, category]);

  return (
    <Col xs={12} md={4}>
      <h3 className="fs-5">Sửa danh mục bài viết</h3>
      <Form onSubmit={handleSubmit(handleUpdate)}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Tên danh mục</Form.Label>
          <Form.Control
            type="text"
            name="name"
            {...register("name")}
            onChange={handleChange}
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
        {categoryImage?.url ? (
          <div
            className="position-relative mb-3"
            style={{ width: "150px", height: "150px" }}
            onClick={openImageModal}
          >
            <Image
              src={categoryImage.url}
              alt={categoryImage?.alt ? categoryImage.alt : "Category image"}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <i
            className="bi bi-card-image"
            style={{ fontSize: "100px", cursor: "pointer" }}
            onClick={openImageModal}
          ></i>
        )}
        <Button type="submit" variant="dark" className="w-100">
          Sửa danh mục{" "}
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
export default Update;
