"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";

export default function RegisterForm({ role = "USER" }) {
  const router = useRouter(); // Redirecting on the client side
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  async function onSubmit(data) {
    data.plan = plan;
    try {
      console.log(data);
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log(responseData);
        setLoading(false);
        toast.success("Usuario creado Exitosamente");
        reset();
        //if role =user => home
        //if role= farmer => onboarding
        // const userRole =responseData.data.role
        if (role === "USER") {
          router.push("/");
        } else {
          const { data } = responseData;
          router.push(`/verify-email?userId=${data.id}`);
        }
      } else {
        setLoading(false);
        if (response.status === 409) {
          setEmailErr("El usuario con este correo electrónico ya existe");
          toast.error("El usuario con este correo electrónico ya existe");
        } else {
          // Handle other errors
          console.error("Server Error:", responseData.error);
          toast.error("Ooops! Algo salió mal");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Algo salió mal. Por favor, vuelva a intentarlo");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <TextInput
        label=""
        name="role"
        register={register}
        errors={errors}
        type="hidden"
        defaultValue={role}
        className="sm:col-span-2 mb-3"
      />
      <TextInput
        label="Nombres Completos"
        name="name"
        register={register}
        errors={errors}
        type="text"
        className="sm:col-span-2 mb-3"
      />
      <TextInput
        label="Direccion Email"
        name="email"
        register={register}
        errors={errors}
        type="email"
        className="sm:col-span-2 mb-3"
      />
      {emailErr && (
        <small className="text-red-600 -mt-2 mb-2">{emailErr}</small>
      )}

      <TextInput
        label="Password"
        name="password"
        register={register}
        errors={errors}
        type="password"
      />

      <SubmitButton
        isLoading={loading}
        buttonTitle="Register"
        loadingButtonTitle="Creando Por favor espera..."
      />

      <div className="flex gap-2 justify-between">
        <p className="text-[0.75rem] font-light text-gray-500 dark:text-gray-400 py-4">
        ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:underline dark:text-purple-500"
          >
            Login
          </Link>
        </p>
        {role === "USER" ? (
          <p className="text-[0.75rem] font-light text-gray-500 dark:text-gray-400 py-4">
            ¿Eres agricultora?{" "}
            <Link
              href="/farmer-pricing"
              className="font-medium text-purple-600 hover:underline dark:text-purple-500"
            >
              Registrate aqui
            </Link>
          </p>
        ) : (
          <p className="text-[0.75rem] font-light text-gray-500 dark:text-gray-400 py-4">
            Eres un Usuario?{" "}
            <Link
              href="/register"
              className="font-medium text-purple-600 hover:underline dark:text-purple-500"
            >
              Registrate aqui
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
