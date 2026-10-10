import { DateFieldSchema, JsonFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';
import { FormStatus } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const FormStatusEnum = Type.Unsafe<FormStatus>({
  type: 'string',
  enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
});
export type FormStatusEnum = FormStatus;

export const FieldOptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
  disabled: Type.Optional(Type.Boolean()),
  description: Type.Optional(Type.String()),
  metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
});

export const OptionsApiSchema = Type.Object({
  endpoint: Type.String(),
  method: Type.Optional(Type.Union([Type.Literal('GET'), Type.Literal('POST')])),
  searchParam: Type.Optional(Type.String()),
  params: Type.Optional(Type.Record(Type.String(), Type.String())),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
  resultsPath: Type.Optional(Type.String()),
  labelKey: Type.Optional(Type.String()),
  valueKey: Type.Optional(Type.String()),
  descriptionKey: Type.Optional(Type.String()),
});

export const BaseFieldSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  name: Type.Optional(Type.String()),
  label: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  placeholder: Type.Optional(Type.String()),
  required: Type.Optional(Type.Boolean()),
  disabled: Type.Optional(Type.Boolean()),
  readonly: Type.Optional(Type.Boolean()),
  defaultValue: Type.Optional(Type.Any()),
  outerClassName: Type.Optional(Type.String()),
  innerClassName: Type.Optional(Type.String()),
  metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
});

export const TextFieldConfigSchema = Type.Composite([
  BaseFieldSchema,
  Type.Object({
    type: Type.Literal('text'),
    minLength: Type.Optional(Type.Number()),
    maxLength: Type.Optional(Type.Number()),
    pattern: Type.Optional(Type.String()),
  }),
]);

export const NumberFieldConfigSchema = Type.Composite([
  BaseFieldSchema,
  Type.Object({
    type: Type.Literal('number'),
    min: Type.Optional(Type.Number()),
    max: Type.Optional(Type.Number()),
    step: Type.Optional(Type.Number()),
  }),
]);

export const SelectFieldConfigSchema = Type.Composite([
  BaseFieldSchema,
  Type.Object({
    type: Type.Literal('select'),
    optionsSource: Type.Optional(Type.Union([Type.Literal('static'), Type.Literal('api')])),
    api: Type.Optional(OptionsApiSchema),
    multiple: Type.Optional(Type.Boolean()),
    searchable: Type.Optional(Type.Boolean()),
    clearable: Type.Optional(Type.Boolean()),
    options: Type.Array(FieldOptionSchema),
    maxSelections: Type.Optional(Type.Number()),
    closeOnSelect: Type.Optional(Type.Boolean()),
  }),
]);

export const AutocompleteFieldConfigSchema = Type.Composite([
  BaseFieldSchema,
  Type.Object({
    type: Type.Literal('autocomplete'),
    optionsSource: Type.Optional(Type.Union([Type.Literal('static'), Type.Literal('api')])),
    api: Type.Optional(OptionsApiSchema),
    multiple: Type.Optional(Type.Boolean()),
    options: Type.Optional(Type.Array(FieldOptionSchema)),
    minSearchLength: Type.Optional(Type.Number()),
    debounceMs: Type.Optional(Type.Number()),
    clearable: Type.Optional(Type.Boolean()),
  }),
]);

export const CustomFieldConfigSchema = Type.Composite([
  BaseFieldSchema,
  Type.Object({
    type: Type.String(),
  }),
]);

export const FormFieldSchema = Type.Union([
  TextFieldConfigSchema,
  NumberFieldConfigSchema,
  SelectFieldConfigSchema,
  AutocompleteFieldConfigSchema,
  CustomFieldConfigSchema,
]);

export const FormActionSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  label: Type.String(),
  variant: Type.Optional(Type.Union([
    Type.Literal('default'),
    Type.Literal('primary'),
    Type.Literal('secondary'),
    Type.Literal('danger'),
    Type.Literal('ghost'),
  ])),
  disabled: Type.Optional(Type.Boolean()),
  outerClassName: Type.Optional(Type.String()),
  innerClassName: Type.Optional(Type.String()),
  metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
});

export const FormConfigSchema = Type.Object({
  fields: Type.Array(FormFieldSchema),
  actions: Type.Optional(Type.Array(FormActionSchema)),
});

export type FormConfig = Static<typeof FormConfigSchema>;

export const FormSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  slug: Type.String(),
  config: FormConfigSchema,
  status: FormStatusEnum,
  userId: Type.String(),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
});

export type GetFormResponse = Static<typeof FormSchema>;

export const GetFormsQuerySchema = Type.Intersect([
  ListQuerySchema,
  Type.Object({
    status: Type.Optional(FormStatusEnum),
  })
]);
export type GetFormsQuery = Static<typeof GetFormsQuerySchema>;

export const GetFormsResponseSchema = PaginatedResponseSchema(FormSchema);
export type GetFormsResponse = Static<typeof GetFormsResponseSchema>;

export const CreateFormBodySchema = Type.Object({
  name: Type.String(),
  slug: Type.String(),
  config: FormConfigSchema,
  status: FormStatusEnum,
});

export type CreateFormBody = Static<typeof CreateFormBodySchema>;

export const UpdateFormBodySchema = Type.Partial(CreateFormBodySchema);

export type UpdateFormBody = Static<typeof UpdateFormBodySchema>;

export const DeleteFormBodySchema = Type.Object({
  isPermanent: Type.Boolean({ default: false }),
});

export type DeleteFormBody = Static<typeof DeleteFormBodySchema>;

export const FormSubmissionSchema = Type.Object({
  id: Type.String(),
  formId: Type.String(),
  data: JsonFieldSchema,
  userId: Type.Union([Type.String(), Type.Null()]),
  ipAddress: Type.Union([Type.String(), Type.Null()]),
  userAgent: Type.Union([Type.String(), Type.Null()]),
  createdAt: DateFieldSchema,
});

export type GetFormSubmissionResponse = Static<typeof FormSubmissionSchema>;

export const GetFormSubmissionsQuerySchema = Type.Intersect([
  ListQuerySchema,
  Type.Object({
    formId: Type.Optional(Type.String()),
  })
]);
export type GetFormSubmissionsQuery = Static<typeof GetFormSubmissionsQuerySchema>;

export const GetFormSubmissionsResponseSchema = PaginatedResponseSchema(FormSubmissionSchema);
export type GetFormSubmissionsResponse = Static<typeof GetFormSubmissionsResponseSchema>;

export const SubmitFormBodySchema = Type.Object({
  data: JsonFieldSchema,
});

export type SubmitFormBody = Static<typeof SubmitFormBodySchema>;

export const SubmitFormResponseSchema = Type.Object({
  id: Type.String(),
  message: Type.String(),
});
export type SubmitFormResponse = Static<typeof SubmitFormResponseSchema>;