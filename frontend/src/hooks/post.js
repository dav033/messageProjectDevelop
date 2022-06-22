import { useMutation, useQuery, useQueryClient } from "react-query";
import socket from "../socket";
import { sendMessage } from "../petitions";
import axios from "axios";

export function useMutatePost(key, petition) {
  const queryClient = useQueryClient();

  return useMutation(petition, {
    onSuccess: (message) => {
      //queryClient.invalidateQueries();
    },
  });
}
