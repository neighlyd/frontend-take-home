import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "./axios";

type MutationArgs = {
  type: "user" | "role";
  onSuccess?: (arg: boolean) => void;
  id: string;
};

export const useDelete = ({ type, onSuccess, id }: MutationArgs) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/${type}s/${id}`),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: [`${type}s`] });
      onSuccess?.(true);
    },
  });

  return deleteMutation;
};

export const useEdit = ({ type, onSuccess, id }: MutationArgs) => {
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (body: { name: string }) =>
      axios.patch(`/${type}s/${id}`, body),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: [`${type}s`] });
      onSuccess?.(true);
    },
  });

  return editMutation;
};
