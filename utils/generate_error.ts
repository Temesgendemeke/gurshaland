import { ApiError } from "next/dist/server/api-utils";

export default function generate_error(error: any) {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error?.message === "string") {
    return error.message;
  }
  return "An unexpected error occurred";
}
