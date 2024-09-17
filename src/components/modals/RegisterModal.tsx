"use client";

import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginState } from "@wix/sdk";
import Cookies from "js-cookie";

import { useWixClient } from "@/hooks/useWixClient";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";

const RegisterModal = () => {
  const wixClient = useWixClient();
  const router = useRouter();

  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    let response;

    setIsLoading(true);
    try {
      response = await wixClient.auth.register({
        email: data.email,
        password: data.password,
        profile: { nickname: data.name },
      });

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          toast.success("Logged in");
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken!
          );
          console.log(tokens);
          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
          });
          wixClient.auth.setTokens(tokens);
          router.refresh();
          registerModal.onClose();
          break;
        case LoginState.FAILURE:
          if (
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            toast.error("Invalid email or password!");
          } else if (response.errorCode === "emailAlreadyExists") {
            toast.error("Email already exists!");
          } else if (response.errorCode === "resetPassword") {
            toast.error("You need to reset your password!");
          } else {
            toast.error("Something went wrong!");
          }
        // case LoginState.EMAIL_VERIFICATION_REQUIRED:
        //   setMode(MODE.EMAIL_VERIFICATION);
        // case LoginState.OWNER_APPROVAL_REQUIRED:
        //   setMessage("Your account is pending approval");
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to MishBaby" subtitle="Create an account!" />
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
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* <ModalButton
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      /> */}
      <div
        className="
                text-neutral-500 
                text-center 
                mt-4 
                font-light
                "
      >
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="
                        text-neutral-800
                        cursor-pointer 
                        hover:underline
                        "
          >
            {" "}
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
