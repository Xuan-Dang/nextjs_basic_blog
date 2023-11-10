import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";
import { putData, getData } from "@/utils/fetchData";
import { useRouter } from "next/router";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

const userUpdateSchema = yup.object({
  fullName: yup.string().required("Họ và tên không được để trống"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  password: yup.string().test({
    name: "checkPassowrrd",
    test: (value, ctx) => {
      if (value && value.length < 6)
        return ctx.createError({
          message: "Mật khẩu phải có tối thiểu 6 ký tự",
        });
      return true;
    },
  }),
  confirmPassword: yup.string().test({
    name: "isMatch",
    test: (value, ctx) => {
      if (ctx.parent.password && !value) {
        return ctx.createError({ message: "Vui lòng xác nhận mật khẩu" });
      }
      if (ctx.parent.password && value !== ctx.parent.password) {
        return ctx.createError({
          message: "Mật khẩu không khớp, vui lòng kiểm tra lại",
        });
      }
      return true;
    },
  }),
});

function UserProfile({ name }) {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const router = useRouter();
  const { id } = router.query;
  const [newAvatar, setNewAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [num, setNum] = useState(0);
  const [userById, setUserById] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(userUpdateSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    if (id) {
      getData(`/auth/${id}`, {
        timeout: 10000,
        signal: controller.signal,
      })
        .then((data) => {
          const newUserData = data.user;
          setValue("fullName", newUserData.fullName, { shouldValidate: true });
          setValue("email", newUserData.email, { shouldValidate: true });
          setUserById((prev) => ({ ...prev, ...newUserData }));
          if (newUserData._id === user._id)
            dispatch({
              type: "USER",
              payload: {
                ...user,
                fullName: newUserData.fullName,
                avatar: newUserData.avatar,
                email: newUserData.email,
                role: newUserData.role,
              },
            });
        })
        .catch((err) => {
          dispatch({
            type: "NOTIFY",
            payload: { success: false, message: err.message },
          });
        });
    }
    return () => {
      controller.abort();
    };
  }, [id, num]);

  useEffect(() => {
    if (newAvatar) setUserById({ ...userById, avatar: newAvatar });
  }, [newAvatar]);

  const openImageModal = () => {
    dispatch({
      type: "IMAGE_MODAL",
      payload: {
        show: true,
        type: "USER_AVATAR",
        cb: (image) => setNewAvatar(image),
      },
    });
  };

  const handleChange = (e) => {
    setTestUser({ [e.target.name]: e.target.value });
  };

  const handleUpdate = async (data) => {
    try {
      setIsLoading(true);
      const res = await putData(
        `/auth/update/${userById._id}`,
        { ...data, avatar: newAvatar },
        {
          timeout: 10000,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
      );
      setIsLoading(false);
      setNum((prev) => prev + 1);
      dispatch({
        type: "NOTIFY",
        payload: {
          success: true,
          message: res.message,
        },
      });
      setValue("password", "", { shouldValidate: true });
      setValue("confirmPassword", "", { shouldValidate: true });
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

  if (!id) return null;

  return (
    <Tab.Pane eventKey={name}>
      <h2 className="fs-4 mb-3">Hồ sơ</h2>
      <Row className="mb-3">
        <Col>
          <div
            className="position-relative rounded-circle"
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() => openImageModal()}
          >
            <Image
              src={userById.avatar}
              fill
              alt={`${userById.fullName} avatar`}
              style={{ objectFit: "cover" }}
            />
          </div>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit(handleUpdate)}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="fullName">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              onChange={handleChange}
              {...register("fullName")}
              readOnly={userById._id !== user._id && user.role !== "admin"}
            />
            <Form.Text className="text-danger">
              {errors.fullName?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              readOnly
              onChange={handleChange}
              {...register("email")}
            />
            <Form.Text className="text-danger">
              {errors.email?.message}
            </Form.Text>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              {...register("password")}
              readOnly={userById._id !== user._id && user.role !== "admin"}
            />
            <Form.Text className="text-danger">
              {errors.password?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="confirmPassword">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              {...register("confirmPassword")}
              readOnly={userById._id !== user._id && user.role !== "admin"}
            />
            <Form.Text className="text-danger">
              {errors.confirmPassword?.message}
            </Form.Text>
          </Form.Group>
        </Row>
        <Form.Group as={Col}>
          {user._id !== userById._id && user.role !== "admin" ? (
            ""
          ) : (
            <Button variant="dark" type="submit">
              Cập nhật hồ sơ{" "}
              {isLoading && (
                <Suspense>
                  <Spinner size="sm" animation="grow" />
                </Suspense>
              )}
            </Button>
          )}
        </Form.Group>
      </Form>
    </Tab.Pane>
  );
}
export default UserProfile;
