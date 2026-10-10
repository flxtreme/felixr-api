import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { CreateFormBody, FormConfig, GetFormResponse, GetFormsQuery, GetFormsResponse, GetFormSubmissionsQuery, GetFormSubmissionsResponse, SubmitFormBody, UpdateFormBody } from './schema';

export const getForms = async (query: GetFormsQuery): Promise<GetFormsResponse> => {
  const { offset, limit, search, isActive, status } = query;

  const where: Prisma.FormWhereInput = {};

  if (status) {
    where.status = status;
    where.isDeleted = status === 'ARCHIVED';
  } else if (isActive === true) {
    where.isDeleted = false;
    where.status = 'PUBLISHED';
  } else if (isActive === false) {
    where.AND = [{ OR: [{ isDeleted: true }, { status: 'DRAFT' }, { status: 'ARCHIVED' }] }];
  } else {
    where.isDeleted = false;
    where.status = { in: ['DRAFT', 'PUBLISHED'] };
  }

  if (search) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      },
    ];
  }

  const [forms, total] = await Promise.all([
    prisma.form.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        config: true,
        status: true,
        userId: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        createdBy: true,
        updatedBy: true,
        deletedBy: true,
      },
    }),
    prisma.form.count({ where }),
  ]);

  return {
    data: forms.map((form) => ({
      ...form,
      config: form.config as FormConfig,
    })),
    meta: resolveMeta(total, offset, limit),
  };
};

export const getForm = async (id: string): Promise<GetFormResponse | null> => {
  const form = await prisma.form.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      config: true,
      status: true,
      userId: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      createdBy: true,
      updatedBy: true,
      deletedBy: true,
    },
  });

  if (!form) return null;

  return {
    ...form,
    config: form.config as FormConfig,
  };
};

export const createForm = async (body: CreateFormBody, userId: string): Promise<GetFormResponse> => {
  const form = await prisma.form.create({
    data: {
      name: body.name,
      slug: body.slug,
      config: body.config as Prisma.InputJsonValue,
      status: body.status,
      userId,
      createdBy: userId,
    },
  });

  return {
    ...form,
    config: form.config as FormConfig,
  };
};

export const updateForm = async (id: string, body: UpdateFormBody, userId: string): Promise<GetFormResponse> => {
  const currForm = await getForm(id);

  if (!currForm) {
    throw new Error('Form not found');
  }

  const form = await prisma.form.update({
    where: { id },
    data: {
      name: body.name ?? currForm.name,
      slug: body.slug ?? currForm.slug,
      config: (body.config ?? currForm.config) as Prisma.InputJsonValue,
      status: body.status ?? currForm.status,
      updatedBy: userId,
      updatedAt: new Date(),
    },
  });

  return {
    ...form,
    config: form.config as FormConfig,
  };
};

export const softDeleteForm = async (id: string, userId: string): Promise<GetFormResponse> => {
  const form = await prisma.form.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
      status: 'ARCHIVED',
    },
  });

  const slug = form.slug;
  const updatedForm = await prisma.form.update({
    where: { id: form.id },
    data: {
      slug: `${slug}-archived`,
      updatedAt: new Date(),
      updatedBy: userId,
    },
  });

  return {
    ...updatedForm,
    config: updatedForm.config as FormConfig,
  };
};

export const deleteForm = async (id: string, userId: string): Promise<GetFormResponse> => {
  const form = await softDeleteForm(id, userId);

  await prisma.form.delete({
    where: { id },
  });

  return form;
};

export const getFormSubmissions = async (query: GetFormSubmissionsQuery): Promise<GetFormSubmissionsResponse> => {
  const { offset, limit, search, isActive, formId } = query;

  const where: Prisma.FormSubmissionWhereInput = {};

  if (formId) {
    where.formId = formId;
  }

  if (search) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        data: {
          path: '$',
          string_contains: search,
          mode: 'insensitive' as const,
        },
      },
    ];
  }

  const [submissions, total] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        formId: true,
        data: true,
        userId: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
      },
    }),
    prisma.formSubmission.count({ where }),
  ]);

  return {
    data: submissions.map((submission) => ({
      ...submission,
      data: submission.data as Record<string, unknown>,
    })),
    meta: resolveMeta(total, offset, limit),
  };
};

export const getFormSubmission = async (id: string) => {
  const submission = await prisma.formSubmission.findUnique({
    where: { id },
    select: {
      id: true,
      formId: true,
      data: true,
      userId: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
    },
  });

  if (!submission) return null;

  return {
    ...submission,
    data: submission.data as Record<string, unknown>,
  };
};

export const createFormSubmission = async (
  formId: string,
  body: SubmitFormBody,
  userId?: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { id: true, status: true },
  });

  if (!form) {
    throw new Error('Form not found');
  }

  if (form.status !== 'PUBLISHED') {
    throw new Error('Form is not published');
  }

  const submission = await prisma.formSubmission.create({
    data: {
      formId,
      data: body.data as Prisma.InputJsonValue,
      userId: userId ?? null,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    },
  });

  return {
    id: submission.id,
    message: 'Form submitted successfully',
  };
};