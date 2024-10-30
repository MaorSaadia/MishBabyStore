"use client";

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ModalButton from "../ui/modal-button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  showCloseButton?: boolean; // Added to optionally hide close button during critical operations
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  showCloseButton = true,
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled || isSubmitting) {
      return;
    }

    setShowModal(false);
    setError(null);

    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose, isSubmitting]);

  const handleSubmit = useCallback(async () => {
    if (disabled || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, disabled, isSubmitting]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction || isSubmitting) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction, isSubmitting]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !disabled && !isSubmitting && showCloseButton) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, disabled, handleClose, isSubmitting, showCloseButton]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
      onClick={(e) => {
        if (
          e.target === e.currentTarget &&
          !disabled &&
          !isSubmitting &&
          showCloseButton
        ) {
          handleClose();
        }
      }}
    >
      <div className="relative w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto lg:h-auto md:h-auto">
        <div
          className={`translate duration-300 h-full 
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}`}
        >
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/* HEADER */}
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
              {showCloseButton && (
                <button
                  className="p-1 border-0 hover:opacity-70 transition absolute left-3"
                  onClick={handleClose}
                  disabled={disabled || isSubmitting}
                  aria-label="Close modal"
                >
                  <IoMdClose size={22} />
                </button>
              )}
              <div className="text-2xl font-semibold">{title}</div>
            </div>

            {/* BODY */}
            <div className="relative p-6 flex-auto">
              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}
              {body}
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-2 p-6">
              <div className="flex flex-row items-center gap-4 w-full">
                {secondaryAction && secondaryActionLabel && (
                  <ModalButton
                    disabled={disabled || isSubmitting}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                    outline
                  />
                )}
                <ModalButton
                  disabled={disabled || isSubmitting}
                  label={isSubmitting ? "Please wait..." : actionLabel}
                  onClick={handleSubmit}
                />
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
