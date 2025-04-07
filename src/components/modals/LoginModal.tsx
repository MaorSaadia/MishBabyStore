"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { LoginState } from "@wix/sdk";
import Cookies from "js-cookie";

import { useWixClient } from "@/hooks/useWixClient";
import useLoginModal from "@/hooks/useLoginModal";
import useResetPasswordModal from "@/hooks/useResetPasswordModal";
import useRegisterModal from "@/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";

const LoginModal = () => {
  const wixClient = useWixClient();
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const resetPasswordModal = useResetPasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setVerificationMessage(""); // Clear any existing message

    try {
      // First, attempt to login
      const response = await wixClient.auth.login({
        email: data.email,
        password: data.password,
      });

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          try {
            // Handle tokens in a separate try/catch block
            const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
              response.data.sessionToken!
            );
            Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
              expires: 2,
            });
            wixClient.auth.setTokens(tokens);

            // Only show success toast and close modal if everything succeeds
            toast.success("Logged in");
            router.refresh();
            loginModal.onClose();
          } catch (tokenError) {
            console.error("Token handling error:", tokenError);
            toast.error(
              "Login succeeded but session setup failed. Please try again."
            );
          }
          break;

        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setVerificationMessage(
            "This email address is not yet verified. Please check your email for the verification code or register again to receive a new verification code."
          );
          break;

        case LoginState.FAILURE:
          if (
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            toast.error("Invalid email or password!");
          } else {
            toast.error("Login failed: " + (response.error || "Unknown error"));
          }
          break;

        default:
          toast.error("Unexpected login state: " + response?.loginState);
          break;
      }
    } catch (error) {
      console.error("Login request error:", error);
      toast.error("Connection error. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onToggle = useCallback(
    (type: string) => {
      loginModal.onClose();
      type === "register"
        ? registerModal.onOpen()
        : resetPasswordModal.onOpen();
    },
    [loginModal, registerModal, resetPasswordModal]
  );

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {verificationMessage && (
        <div className="text-amber-600 text-sm font-medium bg-amber-50 p-3 rounded-md">
          {verificationMessage}
          <button
            onClick={() => onToggle("register")}
            className="text-amber-800 underline ml-1 hover:text-amber-900"
          >
            Register again
          </button>
        </div>
      )}
      <div className="text-neutral-500 font-light -mb-8">
        <p>
          Forgot Password?
          <span
            onClick={() => onToggle("reset")}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Press here
          </span>
        </p>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 -mt-3">
      <div className="text-neutral-500 text-center mt-2 font-light">
        <p>
          First time here?
          <span
            onClick={() => onToggle("register")}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
