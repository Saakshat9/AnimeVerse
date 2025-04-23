// src/api/animeApi.js
const BASE_URL = 'https://api.jikan.moe/v4';

export const fetchTrendingAnime = async () => {
  try {
    const response = await fetch(`${BASE_URL}/top/anime?filter=airing&limit=10`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
};

export const searchAnime = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=20`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

export const getAnimeDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
};

export const getAnimeRecommendations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/recommendations/anime`);
    const data = await response.json();
    return data.data.slice(0, 10); // Get first 10 recommendations
  } catch (error) {
    console.error('Error fetching anime recommendations:', error);
    return [];
  }
};