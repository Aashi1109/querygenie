import {GetByFilterOptions} from "@definitions/types";
import logger from "@logger";
import callsite from "callsite";
import {Prisma} from "@prisma/client";
import {v4 as uuidv4} from "uuid";

/**
 * Queries a particular model based on different params passed to it
 * @template T - Type of the document in the model
 * @param {any} model - The prisma model to use for query
 * @param {object} filter - The filter to use for the query
 * @param {GetByFilterOptions} options - Options to consider while querying
 */
export function getByFilter<T>(
  model: any,
  filter: any,
  options?: GetByFilterOptions,
):
  | Prisma.Prisma__ChatClient<T>
  | Prisma.Prisma__ProjectClient<T>
  | Prisma.Prisma__UserClient<T>
  | Prisma.Prisma__VectorClient<T>
  | Prisma.Prisma__MessageClient<T> {
  try {
    const { limit, sortBy, sortOrder, pageNumber = 1, not } = options || {};
    const skip = limit ? (pageNumber - 1) * limit : 0;

    let where: { id: { equals?: number; not?: number } } = { id: {} };

    let takeFilter = {};
    let orderByFilter = {};

    // check if id exists in filter object
    if (filter?.id) {
      where.id.equals = filter.id;
      delete filter.id;
    }

    if (limit && typeof limit === "number") takeFilter = { take: limit };
    if (not && typeof not === "number") where.id.not = not;
    if (sortBy && sortOrder)
      orderByFilter = { orderBy: { [sortBy]: sortOrder } };

    // merge other filters too
    where = { ...where, ...filter };

    const finalFilters = {
      where,
      skip,
      ...takeFilter,
      ...orderByFilter,
    };

    // console.log(getCallbackName());
    logger.info(`Filters applied: ${jsstr(finalFilters)}`);

    return model.findMany(finalFilters);
  } catch (err) {
    logger.error(`Error fetching data: ${jsstr(err)}`);
    throw err;
  }
}

/**
 * Returns name of the function in which it is called returns null when called in arrow function
 */
export const getCallbackName = () => {
  const stack = callsite();
  return stack[1].getFunctionName();
};

/**
 * Helper function to remove Data URI prefix from a Base64 string.
 * @param {string} base64StringWithPrefix - The Base64 string with Data URI prefix.
 * @returns {string} - The Base64 string without the Data URI prefix.
 */
export function removeDataUriPrefix(base64StringWithPrefix: string): string {
  return base64StringWithPrefix.replace(/^data:.*;base64,/, "");
}

/**
 * Generates v4 uuid string
 */
export const getUUIDv4 = () => {
  return uuidv4();
};

/**
 * Returns stringified version of provided object
 * @param object
 * @returns {string} String representation of object
 */
export const jsstr = (object: any): string => {
  return JSON.stringify(object);
};
