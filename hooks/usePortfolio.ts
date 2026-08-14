"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addHolding,
  getHoldings,
  removeHolding,
  type AddHoldingInput,
} from "@/lib/mock/portfolioStore";
import { queryKeys } from "@/lib/query-keys";

export function usePortfolio() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.portfolio(),
    queryFn: getHoldings,
  });

  const add = useMutation({
    mutationFn: (input: AddHoldingInput) => addHolding(input),
    onSuccess: (holdings) => queryClient.setQueryData(queryKeys.portfolio(), holdings),
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeHolding(id),
    onSuccess: (holdings) => queryClient.setQueryData(queryKeys.portfolio(), holdings),
  });

  return {
    holdings: query.data ?? [],
    isLoading: query.isLoading,
    add: add.mutate,
    remove: remove.mutate,
  };
}
