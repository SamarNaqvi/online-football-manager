import { z } from 'zod';

export const playerQuerySchema = z.object({
  teamName: z.string().optional().default(''),
  playerName: z.string().optional().default(''),
  price: z.coerce.number().optional().default(-1), 
});

export const playerUpdateStatusSchema = z.object({
  status: z.boolean(),
  playerId: z.coerce.number(),
  askingPrice: z.coerce.number().optional().default(-1),
});

export const buyPlayerSchema = z.object({
  teamId: z.coerce.number(),
  playerId: z.coerce.number(),
  playerTeamId: z.coerce.number(),
});


export type PlayerQuerySchema = z.infer<typeof playerQuerySchema>;

export type PlayerUpdateStatusSchema = z.infer<typeof playerUpdateStatusSchema>;

export type BuyPlayerSchema = z.infer<typeof buyPlayerSchema>;
