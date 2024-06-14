"use client";

import CreateServerModal from "@/components/modals/create-server/create-server-modal";
import EditServerModal from "@/components/modals/edit-server/edit-server-modal";
import InviteModal from "@/components/modals/invite/invite-member-modal";
import ManageMembersModal from "@/components/modals/manage-members/manage-members-modal";

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
      <ManageMembersModal />
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
    </>
  );
};
