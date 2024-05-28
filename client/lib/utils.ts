import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { prompt, PROMPT_DELIMITER } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Forms a query URL from a given object of key-value pairs.
 *
 * @param {Object} query - An object containing key-value pairs to be included in the query URL.
 * @returns {string} - A string representing the query URL.
 */
export function formQueryUrl(query: [string, string | number]): string {
  let isInitial = true;
  let queryUrl = "";
  Object.entries(query).forEach((entry) => {
    if (isInitial) {
      queryUrl += `?${entry[0]}=${entry[1]}`;
      isInitial = false;
    } else {
      queryUrl += `&${entry[0]}=${entry[1]}`;
    }
  });

  return queryUrl;
}

export const formQueryPrompt = (query: string, content: string) => {
  const _messages = [...prompt];
  _messages[0].content.replace(PROMPT_DELIMITER, content);
  _messages[1].content = query;

  return _messages;
};
