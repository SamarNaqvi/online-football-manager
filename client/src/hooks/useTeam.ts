import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTeam, changePlayerTransferListStatus } from "../service";

export const useTeam = (userEmail: string) => {
  return useQuery({
    queryKey: ["team", userEmail],
    queryFn: () => fetchTeam(userEmail),
    enabled: !!userEmail,
    select:(resp)=>({...resp?.data?.team, players:resp?.data?.players})
  });
};

export const useUpdatePlayerTransferStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: changePlayerTransferListStatus,
    onSuccess: () => {
      // Invalidate and refetch team data
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
}; 