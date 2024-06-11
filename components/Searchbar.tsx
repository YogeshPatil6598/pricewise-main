"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react'

const isValidProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(
      hostname.includes('amazon.com') || 
      hostname.includes ('amazon.') || 
      hostname.endsWith('amazon') ||
      // hostname.includes('croma.com') || 
      // hostname.includes ('croma.') || 
      // hostname.endsWith('croma')||
      hostname.includes('snapdeal.com') || 
      hostname.includes ('snapdeal.') || 
      hostname.endsWith('snapdeal') ||
      hostname.includes('shopclues.com') || 
      hostname.includes ('shopclues.') || 
      hostname.endsWith('shopclues')
      // hostname.includes('meesho.com') || 
      // hostname.includes ('meesho.') || 
      // hostname.endsWith('meesho')||
      // hostname.includes('jiomart.in') || 
      // hostname.includes ('jiomart.') || 
      // hostname.endsWith('jiomart')||
      // hostname.includes('flipkart.in') || 
      // hostname.includes ('flipkart.') || 
      // hostname.endsWith('flipkart')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidProductURL(searchPrompt);

    if(!isValidLink) return alert('Please provide a valid  link')

    try {
      setIsLoading(true);

      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form 
      className="flex flex-wrap gap-4 mt-12" 
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar