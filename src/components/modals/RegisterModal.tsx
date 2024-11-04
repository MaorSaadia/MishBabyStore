"use client";

import { toast } from "react-hot-toast";
import { useCallback, useState, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginState } from "@wix/sdk";
import Cookies from "js-cookie";

import { useWixClient } from "@/hooks/useWixClient";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import useLoginModal from "@/hooks/useLoginModal";

enum MODE {
  REGISTER = "REGISTER",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  RESEND_VERIFICATION = "RESEND_VERIFICATION",
}

const COOLDOWN_DURATION = 30; // Cooldown duration in seconds

const RegisterModal = () => {
  const wixClient = useWixClient();
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const [mode, setMode] = useState<MODE>(MODE.REGISTER);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [cooldownTimer, setCooldownTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      verificationCode: "",
    },
  });

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((current) => Math.max(0, current - 1));
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cooldownTimer]);

  const startCooldown = () => {
    setCooldownTimer(COOLDOWN_DURATION);
  };

  const handleSuccessfulLogin = async (response: any) => {
    try {
      const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
        response.data.sessionToken
      );
      Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
        expires: 2,
      });
      wixClient.auth.setTokens(tokens);
      toast.success("You have successfully registered!");
      router.refresh();
      registerModal.onClose();
      reset();
    } catch (error) {
      console.error("Error setting tokens:", error);
      toast.error("Error completing authentication");
    }
  };

  const handleEmailAlreadyExists = async (email: string) => {
    try {
      const response = await wixClient.auth.login({
        email,
        password: getValues().password,
      });

      if (response.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
        setCurrentEmail(email);
        setMode(MODE.EMAIL_VERIFICATION);
        setMessage("A new verification code has been sent to your email");
        startCooldown();
        return true;
      } else {
        toast.error("This email is already registered and verified");
        return false;
      }
    } catch (error) {
      console.error("Error handling existing email:", error);
      toast.error("Something went wrong. Please try again.");
      return false;
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

          if (
            response?.loginState === LoginState.FAILURE &&
            response?.errorCode === "emailAlreadyExists"
          ) {
            const handled = await handleEmailAlreadyExists(data.email);
            if (!handled) {
              setIsLoading(false);
              return;
            }
          } else if (
            response?.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED
          ) {
            startCooldown();
          }
          break;

        case MODE.EMAIL_VERIFICATION:
          response = await wixClient.auth.processVerification({
            verificationCode: data.verificationCode,
          });
          break;

        case MODE.RESEND_VERIFICATION:
          if (cooldownTimer > 0) {
            toast.error(
              `Please wait ${cooldownTimer} seconds before requesting a new code`
            );
            setIsLoading(false);
            return;
          }

          const loginResponse = await wixClient.auth.login({
            email: currentEmail || data.email,
            password: data.password,
          });

          if (
            loginResponse.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED
          ) {
            setMode(MODE.EMAIL_VERIFICATION);
            setMessage("A new verification code has been sent to your email");
            startCooldown();
            setIsLoading(false);
            return;
          }
          response = loginResponse;
          break;
      }

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          await handleSuccessfulLogin(response);
          break;

        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setCurrentEmail(data.email);
          setMode(MODE.EMAIL_VERIFICATION);
          setMessage("Please check your email for verification code");
          startCooldown();
          break;

        case LoginState.FAILURE:
          if (response.errorCode === "emailAlreadyExists") {
            await handleEmailAlreadyExists(data.email);
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
    if (newMode === MODE.REGISTER) {
      setCurrentEmail("");
      setCooldownTimer(0);
      reset();
    }
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
          mode === MODE.REGISTER
            ? "Create an account!"
            : mode === MODE.EMAIL_VERIFICATION
            ? "Verify your email"
            : "Resend verification code"
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

      {message && (
        <div className="text-md text-green-600 -mt-2 -mb-8">{message}</div>
      )}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 -mt-6">
      <div className="text-neutral-500 text-center mt-4 font-light">
        {mode === MODE.REGISTER && (
          <div className="text-neutral-500 text-center mt-4 font-light">
            <p>
              Already have an account?
              <span
                onClick={onToggle}
                className="text-neutral-800 cursor-pointer hover:underline ml-1"
              >
                Log in
              </span>
            </p>
          </div>
        )}
        {mode === MODE.EMAIL_VERIFICATION && (
          <div className="flex flex-col gap-2">
            <p>
              <span
                onClick={() => switchMode(MODE.REGISTER)}
                className="text-neutral-800 cursor-pointer hover:underline"
              >
                Back to register
              </span>
            </p>
            <p>
              Didn&apos;t receive the code?
              {cooldownTimer > 0 ? (
                <span className="text-neutral-400 ml-1">
                  Wait {cooldownTimer}s to resend
                </span>
              ) : (
                <span
                  onClick={() => switchMode(MODE.RESEND_VERIFICATION)}
                  className="text-neutral-800 cursor-pointer hover:underline ml-1"
                >
                  Resend verification code
                </span>
              )}
            </p>
          </div>
        )}
        {mode === MODE.RESEND_VERIFICATION && (
          <div className="flex flex-col gap-2">
            <p>
              <span
                onClick={() => switchMode(MODE.REGISTER)}
                className="text-neutral-800 cursor-pointer hover:underline"
              >
                Back to register
              </span>
            </p>
            <p>
              <span
                onClick={() => switchMode(MODE.EMAIL_VERIFICATION)}
                className="text-neutral-800 cursor-pointer hover:underline"
              >
                Back to verification
              </span>
            </p>
            {cooldownTimer > 0 && (
              <p className="text-neutral-400">
                Wait {cooldownTimer}s to resend code
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const actionLabel =
    mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.EMAIL_VERIFICATION
      ? "Verify"
      : "Resend Code";

  return (
    <Modal
      disabled={
        isLoading || (mode === MODE.RESEND_VERIFICATION && cooldownTimer > 0)
      }
      isOpen={registerModal.isOpen}
      title={
        mode === MODE.REGISTER
          ? "Register"
          : mode === MODE.EMAIL_VERIFICATION
          ? "Verify Email"
          : "Resend Verification"
      }
      actionLabel={actionLabel}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
