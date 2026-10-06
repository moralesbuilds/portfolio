import { cache } from "react";
import { fetchProjectDetails as _fetchProjectDetails } from "@moralesbuilds/contents-db";

export const fetchProjectDetails = cache(_fetchProjectDetails);
