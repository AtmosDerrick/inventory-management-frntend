"use client";

import { BackgroundImage } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
  Title,
} from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
export default function Home() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Replace with your actual login logic
      console.log("Form values:", form.values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Handle successful login (redirect, etc.)
    } catch (error) {
      console.error("Login failed:", error);
      form.setErrors({
        email: "Invalid credentials",
        password: "Invalid credentials",
      });
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
              School Inventory Managment System
            </h2>
          </div>
        </BackgroundImage>
      </div>
      <div className="w-2/5 flex items-center">
        <div className="w-full">
          <Container size={460} my={40}>
            <Title ta="center" mb={12}>
              Welcome back!
            </Title>
            <Text color="dimmed" ta={"center"} size="sm" mt={5} mb={24}>
              Do not have an account yet?{" "}
              <Anchor<"a">
                href="#"
                size="sm"
                onClick={(event) => event.preventDefault()}>
                Create account
              </Anchor>
            </Text>

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
                />

                <Group>
                  <Anchor<"a">
                    onClick={(event) => event.preventDefault()}
                    href="#"
                    size="sm">
                    Forgot password?
                  </Anchor>
                </Group>
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
