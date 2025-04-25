"use client";

import { BackgroundImage, Checkbox } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
  Container,
  Title,
} from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 3
          ? "Password should include at least 4 characters"
          : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/login/",
        {
          username: values.email,
          password: values.password,
        }
      );

      console.log(response, "lol");

      if (response.status === 200) {
        toast.success("Login successful");
        return router.push("/inventory");
      } else {
        toast.error("Invalid Credential");
      }
    } catch (error) {
      toast.error("Login Failed, Try again");

      // form.setErrors({
      //   email: "Invalid credentials",
      //   password: "Invalid credentials",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-between">
      <div className="w-3/5 h-screen bg-green-500">
        <BackgroundImage
          src={
            "https://i.pinimg.com/736x/64/d3/b6/64d3b6c316a9843de9f7e86ee318aa06.jpg"
          }
          radius="sm"
          className="w-full h-full">
          <div className="mx-4 text-center pt-6">
            <h2 className="text-white drop-shadow-lg font-bold text-2xl bg-gray-700 py-2">
              School Inventory Management System
            </h2>
          </div>
        </BackgroundImage>
      </div>
      <div className="w-2/5 flex items-center">
        <ToastContainer />
        <div className="w-full">
          <Container size={460} my={40}>
            <Title ta="center" mb={12}>
              Welcome back!
            </Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput
                  required
                  label="Email"
                  placeholder="hello@mantine.dev"
                  value={form.values.email}
                  onChange={(event) =>
                    form.setFieldValue("email", event.currentTarget.value)
                  }
                  error={form.errors.email}
                  leftSection={<IconAt size="1rem" />}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue("password", event.currentTarget.value)
                  }
                  error={form.errors.password}
                  leftSection={<IconLock size="1rem" />}
                />
              </Stack>

              <Group mt="xl">
                <Button type="submit" loading={loading} fullWidth>
                  Login
                </Button>
              </Group>
            </form>
          </Container>
        </div>
      </div>
    </div>
  );
}
