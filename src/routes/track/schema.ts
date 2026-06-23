import { Static, Type } from '@sinclair/typebox';

export const TrackBodySchema = Type.Object({
  payload: Type.Array(Type.String())
});

export type TrackBody = Static<typeof TrackBodySchema>;

export const TrackResponseSchema = Type.Object({
  success: Type.Boolean()
});

export type TrackResponse = Static<typeof TrackResponseSchema>;

export const GetViewsQuerySchema = Type.Object({
  path: Type.Array(Type.String())
});

export type GetViewsQuery = Static<typeof GetViewsQuerySchema>;

export const GetViewsResponseSchema = Type.Object({
  views: Type.Number()
});

export type GetViewsResponse = Static<typeof GetViewsResponseSchema>;
