import { cache } from "react";
import { fetchBlogPostDetails as _fetchBlogPostDetails } from "@moralesbuilds/contents-db";

export const fetchBlogPostDetails = cache(_fetchBlogPostDetails);
