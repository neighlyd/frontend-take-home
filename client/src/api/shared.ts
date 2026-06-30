import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "./axios";

export const useDelete = ({
  type,
  onSuccess,
}: {
  type: "user" | "role";
  onSuccess?: (arg: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/${type}s/${id}`),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: [`${type}s`] });
      onSuccess?.(true);
    },
  });

  return deleteMutation;
};
