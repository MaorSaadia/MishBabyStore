"use client";

import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginState } from "@wix/sdk";
import Cookies from "js-cookie";

import { useWixClient } from "@/hooks/useWixClient";
import useRegisterModal from "@/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import LoginModal from "./LoginModal";
import useLoginModal from "@/hooks/useLoginModal";

enum MODE {
  REGISTER = "REGISTER",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const RegisterModal = () => {
  const wixClient = useWixClient();
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const [mode, setMode] = useState<MODE>(MODE.REGISTER);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      verificationCode: "",
    },
  });

  const handleSuccessfulLogin = async (response: any) => {
    try {
      const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
        response.data.sessionToken
      );
      Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
        expires: 2,
      });
      wixClient.auth.setTokens(tokens);
      toast.success("You have successfully authenticated!");
      router.refresh();
      registerModal.onClose();
      reset();
    } catch (error) {
      console.error("Error setting tokens:", error);
      toast.error("Error completing authentication");
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setMessage("");

    try {
      let response;

      switch (mode) {
        case MODE.REGISTER:
          response = await wixClient.auth.register({
            email: data.email,
            password: data.password,
            profile: { nickname: data.name },
          });
          break;

        case MODE.EMAIL_VERIFICATION:
          response = await wixClient.auth.processVerification({
            verificationCode: data.verificationCode,
          });
          break;
      }

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          await handleSuccessfulLogin(response);
          break;

        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);
          setMessage("Please check your email for verification code");
          break;

        case LoginState.FAILURE:
          if (response.errorCode === "emailAlreadyExists") {
            toast.error("Email already exists!");
          } else {
            toast.error("Something went wrong!");
          }
          break;

        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage("Your account is pending approval");
          break;

        default:
          toast.error("Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: MODE) => {
    setMode(newMode);
    setMessage("");
    reset();
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to MishBaby"
        subtitle={
          mode === MODE.REGISTER ? "Create an account!" : "Verify your email"
        }
      />

      {mode === MODE.REGISTER && (
        <>
          <Input
            id="name"
            label="Name"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
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
        </>
      )}

      {mode === MODE.EMAIL_VERIFICATION && (
        <Input
          id="verificationCode"
          label="Verification Code"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      )}

      {message && <div className="text-sm text-green-600 mt-2">{message}</div>}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 -mt-6">
      <div className="text-neutral-500 text-center mt-4 font-light">
        {mode === MODE.REGISTER ? (
          <div className="text-neutral-500 text-center mt-4 font-light">
            <p>
              Already have an account?
              <span
                onClick={onToggle}
                className="text-neutral-800cursor-pointer hover:underline"
              >
                {" "}
                Log in
              </span>
            </p>
          </div>
        ) : (
          <p>
            <span
              onClick={() => switchMode(MODE.REGISTER)}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Back to register
            </span>
          </p>
        )}
      </div>
    </div>
  );

  const actionLabel = mode === MODE.REGISTER ? "Register" : "Verify";

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title={mode === MODE.REGISTER ? "Register" : "Verify Email"}
      actionLabel={actionLabel}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
