import type { Category } from "../models/userPreferences.Model.js";

let requestOptions = {
  method: "GET",
};

interface NewsParams {
  api_token: string;
  category: Category;
  locale: string;
  language: string;
  source?: string;
  limit?: number;
}

export default async function getNews(params: NewsParams) {
  let esc = encodeURIComponent;

  let query = Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k as keyof NewsParams] as string))
    .join("&");

  const response = await fetch(
    "https://api.thenewsapi.com/v1/news/top?" + query,
    requestOptions
  );

  const data = await response.json();

  return data;
}