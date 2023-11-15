import Layout from "@/components/Layout";
import Head from "next/head";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { Row, Col, Form, Breadcrumb, Button } from "react-bootstrap";
import { getData, putData } from "@/utils/fetchData";
import { DataContext } from "@/context/AppProviders";
import Link from "next/link";
import dynamic from "next/dynamic";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import createSlug from "@/utils/createSlug";
import Image from "next/image";
import { useRouter } from "next/router";

const Editor = dynamic(
  () => {
    return import("../../../../components/Editor");
  },
  { ssr: false }
);

const Spinner = lazy(() => import("react-bootstrap/Spinner"));

const schema = yup.object({
  title: yup.string().required("Vui lòng nhập tiêu đề"),
  url: yup.string().test({
    title: "testPostCategoryUrl",
    test: (value, ctx) => {
      if (ctx.parent.title && !value)
        ctx.createError({ message: "Url không được để trống" });
      return true;
    },
  }),
  description: yup.string(),
});

function update() {
  const { state, dispatch } = useContext(DataContext);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState({});
  const [selectedTag, setSelectedTag] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPublish, setIsPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState({});
  const [num, setNum] = useState(0);
  const router = useRouter();
  const { id } = router.query;

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
      title: "",
      url: "",
      description: "",
    },
  });

  const handleChange = (e) => {
    if (e.target.name === "title")
      setValue("url", createSlug(e.target.value), { shouldValidate: true });
  };

  const handleSelectTag = (data) => {
    setSelectedTag([...data]);
  };

  const handleSelectCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSelectIsPublish = (e) => {
    setIsPublish(e.target.value);
  };

  const handleSelectImage = (image) => {
    setImage({ ...image });
  };

  const handleOpenImageModal = () => {
    dispatch({
      type: "IMAGE_MODAL",
      payload: {
        show: true,
        cb: handleSelectImage,
        type: "POST_IMAGE",
      },
    });
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      const res = await putData(
        `/post/manager/update/${post._id}`,
        {
          ...data,
          category: selectedCategory,
          tags: JSON.stringify([...selectedTag]),
          image: image._id,
          isPublish,
          content,
        },
        {
          timeout: 10000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setIsLoading(false);
      setNum((prev) => prev + 1);
      dispatch({
        type: "NOTIFY",
        payload: { success: true, message: res.message },
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      return dispatch({
        type: "NOTIFY",
        payload: { success: false, message: err.message },
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getData(`/tag?limit=0&page=1`, {
      timeout: 10000,
      signal: controller.signal,
    })
      .then((data) => {
        const tags =
          data?.tags &&
          data.tags.map((tag) => {
            return { value: tag._id, label: tag.name };
          });
        tags && setTags([...tags]);
      })
      .catch((err) =>
        dispatch({
          type: "NOTIFY",
          payload: { success: false, message: err.message },
        })
      );

    getData(`/post-category?limit=0&page=1`, {
      timeout: 10000,
      signal: controller.signal,
    })
      .then((data) => {
        data?.postCategories && setCategories([...data.postCategories]);
      })
      .catch((err) => {
        dispatch({
          type: "NOTIFY",
          payload: { success: false, message: err.message },
        });
      });

    if (id) {
      getData(`/post/manager/${id}`, {
        timeout: 10000,
        signal: controller.signal,
      })
        .then((data) => {
          const { post } = data;
          const selectedTag =
            post?.tags &&
            post.tags.map((item) => ({
              value: item.tagId._id,
              label: item.tagId.name,
            }));
          selectedTag && setSelectedTag([...selectedTag]);
          setSelectedCategory(post.category);
          setPost({ ...post });
          post?.title && setValue("title", post.title);
          post?.url && setValue("url", post.url);
          post?.description && setValue("description", post.description);
          post?.content && setContent(post.content);
          post?.image && setImage({ ...post.image });
        })
        .catch((err) => {
          return dispatch({
            type: "NOTIFY",
            payload: {
              success: false,
              message: err.message,
            },
          });
        });
    }
    return () => {
      controller.abort();
    };
  }, [id, num]);

  return (
    <Layout>
      <Head>
        <title>Cập nhật bài viết</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Manager</Breadcrumb.Item>
            <Link href="/manager/post" className="breadcrumb-item">
              Bài viết
            </Link>
            <Breadcrumb.Item active>Cập nhật</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="card-title fs-3">Cập nhật bài viết</h1>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit(handleUpdate)}>
        <Row>
          <Col xs={12} md={6} lg={8}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                {...register("title")}
                onChange={handleChange}
              />
              <Form.Text className="text-danger">
                {errors.title?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="url">
              <Form.Label>Url</Form.Label>
              <Form.Control type="text" name="url" {...register("url")} />
              <Form.Text className="text-danger">
                {errors.url?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                {...register("description")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Nội dung</Form.Label>
              <Editor content={content} setContent={setContent} />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Form.Group>
              <Form.Label>Ảnh bài viết</Form.Label>
              {image?.url ? (
                <div
                  className="position-relative mb-3"
                  style={{ width: "150px", height: "150px" }}
                  onClick={handleOpenImageModal}
                >
                  <Image
                    src={image.url}
                    alt={image?.alt ? image.alt : "Category image"}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div>
                  <i
                    className="bi bi-card-image"
                    style={{ fontSize: "100px", cursor: "pointer" }}
                    onClick={handleOpenImageModal}
                  ></i>
                </div>
              )}
              <Button type="submit" variant="dark" className="my-3">
                Cập nhật bài viết
                {isLoading && (
                  <Suspense>
                    <Spinner animation="grow" size="sm" className="ms-2" />
                  </Suspense>
                )}
              </Button>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select name="isPublish" onChange={handleSelectIsPublish}>
                <option value="">Chọn trạng thái</option>
                <option value={false} selected={post?.isPublish ? true : false}>
                  Ẩn
                </option>
                <option value={true} selected={post?.isPublish ? true : false}>
                  Hiển thị
                </option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Chọn danh mục</Form.Label>
              <Form.Select name="category" onChange={handleSelectCategory}>
                <option value="">Chọn một danh mục</option>
                {categories.map((category) => {
                  return (
                    <option
                      value={category._id}
                      key={category._id}
                      selected={category._id === selectedCategory?._id}
                    >
                      {category.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Chọn tag</Form.Label>
              {console.log(selectedTag)}
              <Select
                options={tags}
                value={selectedTag}
                isMulti
                onChange={handleSelectTag}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
}
export default update;
