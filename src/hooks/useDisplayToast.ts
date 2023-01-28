import { useToast } from "@chakra-ui/react";
import { shake } from "radash";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import useStore from "./store";
import { ToastKeyParam } from "./store/toast";

export const useDisplayToast = () => {
  const toast = useToast();
  const toastSlice = useStore((state) => state.toast, shallow);

  useEffect(() => {
    const filteredToastSlice = shake(toastSlice);
    const toastKeys = Object.keys(filteredToastSlice).filter(
      (key) => key !== "setToast"
    );
    toastKeys.forEach((key) => {
      const toastParams = toastSlice[key as ToastKeyParam];
      if (toast.isActive(`${key}-${toastParams?.title}`)) return;
      toast({
        id: `${key}-${toastParams?.title}`,
        title: toastParams?.title,
        description: toastParams?.description,
        status: key as ToastKeyParam,
        onCloseComplete: () => {
          toastSlice.setToast(key as ToastKeyParam, undefined);
        },
        position: "top-right",
      });
    });
  }, [toastSlice, toast]);
};
