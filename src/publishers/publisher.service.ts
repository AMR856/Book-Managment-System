import {
  getPublisherByID,
  getAllPublishers,
  getPublisherByEmail,
  createPublisher,
  deletePublisher,
  updatePublisher,
} from "./publisher.model";
import CustomError from "../types/customError";
import { PublisherData } from "../types/publisherData";

export const createPublisherService = async (data: PublisherData) => {
  if (!data){
    throw new CustomError("Please, include the body of the request", 400);
  }
  console.log(data);
  const isExist = await getPublisherByEmail(data.email);
  if (isExist) {
    throw new CustomError("A publisher with this email already exist", 409);
  }
  return createPublisher(data);
};

export const getAllPublishersService = async () => {
  return getAllPublishers();
};

export const getPublisherService = async (id: Number | undefined) => {
  if (!id){
    throw new CustomError("Please include the id of the publisher", 400);
  }
  const publisher = await getPublisherByID(id);
  if (!publisher) {
    throw new CustomError("Publisher with this ID doesn't exist", 404);
  }
  return publisher;
};

export const deletePublisherService = async (id: Number | undefined) => {
  if (!id){
    throw new CustomError("Please include the id of the publisher", 400);
  }
  const publisher = await getPublisherByID(id);
  if (!publisher) {
    throw new CustomError("Publisher with this ID doesn't exist", 404);
  }
  return await deletePublisher(id);
};

export const updatePublisherService = async (data: PublisherData) => {
  const { createdAt, updatedAt, id, ...safeData } = data;
  if (!id){
    throw new CustomError("Please include the id of the publisher", 400);
  }
  const publisherID = await getPublisherByID(Number(id));
  if (!publisherID) {
    throw new CustomError("Publisher with this ID doesn't exist", 404);
  }
  const publisherEmail = await getPublisherByEmail(safeData.email);
  if (publisherEmail) {
    throw new CustomError("Can't have two publishers with the same email", 400);
  }
  return await updatePublisher(id, safeData);
};
