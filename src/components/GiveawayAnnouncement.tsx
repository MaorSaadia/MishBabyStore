"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

type GiveawayContextType = {
  isOpen: boolean;
  showGiveaway: () => void;
  hideGiveaway: () => void;
  setIsOpen: (value: boolean) => void;
};

const GiveawayContext = createContext<GiveawayContextType>({
  isOpen: false,
  showGiveaway: () => {},
  hideGiveaway: () => {},
  setIsOpen: () => {},
});

type GiveawayProviderProps = {
  children: ReactNode;
};

export const GiveawayProvider = ({ children }: GiveawayProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const showGiveaway = () => setIsOpen(true);
  const hideGiveaway = () => setIsOpen(false);

  return (
    <GiveawayContext.Provider
      value={{ isOpen, showGiveaway, hideGiveaway, setIsOpen }}
    >
      {children}
    </GiveawayContext.Provider>
  );
};

export const useGiveawayStore = () => {
  const context = useContext(GiveawayContext);
  if (!context) {
    throw new Error("useGiveawayStore must be used within a GiveawayProvider");
  }
  return context;
};

const GiveawayAnnouncement = () => {
  const [hasShownInitial, setHasShownInitial] = useState(true);
  const { isOpen, setIsOpen } = useGiveawayStore();

  useEffect(() => {
    const hasSeenAnnouncement = localStorage.getItem("hasSeenGiveaway");
    if (!hasSeenAnnouncement && !hasShownInitial) {
      setIsOpen(true);
      setHasShownInitial(true);
      localStorage.setItem("hasSeenGiveaway", "true");
    }
  }, [hasShownInitial, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            🎉 Special Giveaway! 🎉
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          <div className="space-y-6">
            {/* <div className="relative w-full h-80 sm:h-96">
              <Image
                src="/announcement-giveaway.png"
                alt="Giveaway announcement"
                className="rounded-lg shadow-lg object-cover"
                width={940}
                height={788}
              />
            </div> */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Enter Our Lucky Draw!</h3>
              <p className="text-sm">
                How to participate and join our exciting giveaway event!
              </p>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Sign up for an account</li>
                <li>Make a purchase over $9.99</li>
                <li>Automatically enter the lottery!</li>
              </ul>
              <p className="text-sm mt-4 font-medium text-primary">
                Don&apos;t miss out on your chance to win up to $30 in
                giftcards!
              </p>
              <p className="text-xs text-gray-400">
                The giveaway ends on November 30, 2024.
              </p>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default GiveawayAnnouncement;
