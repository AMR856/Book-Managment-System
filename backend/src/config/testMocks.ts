import { Request, Response, NextFunction } from "express";
import { jest } from "@jest/globals";

export const createMockRequest = (overrides?: Partial<Request>): Request => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  } as Request;
};

export const createMockResponse = (overrides?: Partial<Response>): Response => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    locals: {},
    ...overrides,
  } as unknown as Response;
  return res;
};

export const createMockNextFunction = (): NextFunction => {
  return jest.fn();
};
