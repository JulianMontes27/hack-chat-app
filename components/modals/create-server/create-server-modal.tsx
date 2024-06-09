"use client";

import { CreateModalForm } from "./modal-form";
import useModalStore from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateServerModal() {
  const { isOpen, onClose, modalType } = useModalStore();
  const handleClose = () => {
    onClose();
  };
  // const [isMounted, setisMounted] = useState(false);
  // useEffect(() => {
  //   setisMounted(true);
  // }, []);
  // if (!isMounted) return null;

  return (
    <Dialog
      open={isOpen && modalType === "create-server"}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Create server
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2">
            <span className="text-[16px] font-semibold ">
              Start working together with other devs!
            </span>
            <span>
              Customize your server. Be sure to make it unique and inviting to
              others!
            </span>
          </DialogDescription>
        </DialogHeader>
        {/* {create-modal form} */}
        <CreateModalForm />
      </DialogContent>
    </Dialog>
  );
}
