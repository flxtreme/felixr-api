import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, JsonFieldSchema, MetaSchema } from '../../core/schema';

export const TrackActionSchema = Type.Union([
  Type.Literal('view'),
  Type.Literal('insert'),
  Type.Literal('soft_delete'),
  Type.Literal('delete'),
  Type.Literal('update'),
  Type.Literal('download'),
  Type.Literal('redirect'),
]);
export type TrackAction = Static<typeof TrackActionSchema>;

export const TrackChangesSchema = Type.Object({
  data: Type.Record(Type.String(), Type.Any()),
  update: Type.Record(Type.String(), Type.Any()),
});

export const TrackSchema = Type.Object({
  id: Type.String(),
  visitorId: Type.String(),
  action: TrackActionSchema,
  path: Type.Array(Type.String()),
  currentUrl: Type.String(),
  parameters: JsonFieldSchema,
  from: JsonFieldSchema,
  visitor: JsonFieldSchema,
  location: JsonFieldSchema,
  changes: Type.Union([TrackChangesSchema, Type.Null()]),
  ip: Type.Union([Type.String(), Type.Null()]),
  timestamp: DateFieldSchema,
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});

export type Track = Static<typeof TrackSchema>;

export const GetTracksQuerySchema = Type.Object({
  offset: Type.Optional(Type.Number({ minimum: 0 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
  search: Type.Optional(Type.String()),
  action: Type.Optional(TrackActionSchema),
  visitorId: Type.Optional(Type.String()),
  path: Type.Optional(Type.String()),
  currentUrl: Type.Optional(Type.String()),
  ip: Type.Optional(Type.String()),
  timestampFrom: Type.Optional(Type.String({ format: 'date-time' })),
  timestampTo: Type.Optional(Type.String({ format: 'date-time' })),
});

export type GetTracksQuery = Static<typeof GetTracksQuerySchema>;

export const GetTracksResponseSchema = Type.Object({
  data: Type.Array(TrackSchema),
  meta: MetaSchema,
});

export type GetTracksResponse = Static<typeof GetTracksResponseSchema>;

export const BulkDeleteTracksBodySchema = Type.Object({
  ids: Type.Array(Type.String(), { minItems: 1 }),
});

export type BulkDeleteTracksBody = Static<typeof BulkDeleteTracksBodySchema>;

export const BulkDeleteTracksResponseSchema = Type.Object({
  deletedCount: Type.Number(),
});

export type BulkDeleteTracksResponse = Static<typeof BulkDeleteTracksResponseSchema>;

export const TrackBodySchema = Type.Object({
  payload: Type.Array(Type.String())
});

export type TrackBody = Static<typeof TrackBodySchema>;

export const TrackResponseSchema = Type.Object({
  success: Type.Boolean()
});

export type TrackResponse = Static<typeof TrackResponseSchema>;

export const GetViewsQuerySchema = Type.Object({
  path: Type.String()
});

export type GetViewsQuery = Static<typeof GetViewsQuerySchema>;

export const GetViewsResponseSchema = Type.Object({
  views: Type.Number()
});

export type GetViewsResponse = Static<typeof GetViewsResponseSchema>;
