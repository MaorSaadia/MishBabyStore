"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { useWixClient } from "@/hooks/useWixClient";
import useLoginModal from "@/hooks/useLoginModal";
import useResetPasswordModal from "@/hooks/useResetPasswordModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";

const ResetPasswordModal = () => {
  const wixClient = useWixClient();
  const resetPasswordModal = useResetPasswordModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await wixClient.auth.sendPasswordResetEmail(
        email,
        window.location.href
      );
      // console.log(response);
      setMessage(
        "Password reset email sent. Please check your e-mail. The email may take up to 2 minutes to arrive."
      );
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onToggle = useCallback(() => {
    resetPasswordModal.onClose();
    loginModal.onOpen();
  }, [resetPasswordModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title={"Enter Your Email"} />
      <Input
        id="email"
        label="Email"
        disabled={isLoading || isSubmitted}
        register={register}
        errors={errors}
        required
      />
      {message && <div className="text-sm text-green-500">{message}</div>}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4">
      <hr />
      <div className="text-neutral-500 text-center font-light">
        <p>
          <span
            onClick={onToggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Go Back
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={resetPasswordModal.isOpen}
      title={"Reset Password"}
      actionLabel={isSubmitted ? undefined : "Reset"}
      onClose={resetPasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ResetPasswordModal;
