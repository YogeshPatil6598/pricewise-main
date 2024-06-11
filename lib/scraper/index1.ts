import axios from 'axios';

const apiKey = '3f39366e47msh6cb91698b9947e0p1dafefjsna4d525e00e07';
const apiHost = 'amazon-historical-price.p.rapidapi.com';

interface PriceData {
  date: string;
  price: number;
}

interface ApiResponse {
  prices: PriceData[];
}

export async function fetchHistoricalPrice(url: string): Promise<{ lowestPrice?: number; highestPrice?: number; error?: string }> {
  const options = {
    method: 'GET',
    url: `https://${apiHost}/api/sc/amazon/historical_price`,
    params: { item_url: url },
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };

  try {
    const response = await axios.request<ApiResponse>(options);
    const data = response.data;

    if (data && data.prices && data.prices.length > 0) {
      const prices = data.prices.map(price => price.price);
      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      return { lowestPrice, highestPrice };
    } else {
      return { error: 'No price data available for this product.' };
    }
  } catch (error) {
    return { error: 'An error occurred while fetching the price data.' };
  }
}
