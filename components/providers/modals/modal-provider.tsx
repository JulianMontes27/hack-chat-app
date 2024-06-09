"use client";

import CreateServerModal from "@/components/modals/create-server/create-server-modal";
import InviteModal from "@/components/modals/invite/invite-member-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);
  if (!isMounted) {
    //we are still on the server
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <InviteModal />
    </>
  );
};
