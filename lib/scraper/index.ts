"use server"
import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice} from '../utils';
//import { index } from 'cheerio/lib/api/traversing';
import puppeteer from 'puppeteer'
//import Chart from 'chart.js';


export async function scrapeAmazonProduct(url: string) {

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (100000* Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }
  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    //console.log(response.data)
    
   
    //const graphData: number[] = [];

    // Example: Assuming the graph data is stored in a div with class 'graph-container'
    // const graphData=$('#apexchartspriceHistory').text().trim();
    // console.log(graphData);
  
    // Extract the product title
    const title = $('#productTitle').text().trim() ||
     $('.pdp-e-i-head').text().trim() ||
      //$('sc-eDvSVe.fhfLdV').text().trim() ||
       $('#deta_container,h1').text().trim()||
        $('h1').first().text()||
        $('#pdp_product_name').text().trim() ;


    //const star=$('#acrPopover').text().trim();

    //const title = $('#productTitle').text().trim();
    // const title = $('#productTitle,.pdp-e-i-head,.sc-eDvSVe.fhfLdV,#deta_container,h1').text().trim();
    console.log({title})
    

    
    const currentPrice = extractPrice(
      $('.priceToPay span.a-price-whole'),
      $('.a.size.base.a-color-price'),
      $('.dp-shm-pdp-price'),
      $('.a-button-selected .a-color-base'),
      $('span.pdp-final-price'),
      $('.new-price .amount #pdp-product-price'),
      $('.sc-eDvSVe.biMVPh'),
      $('div.prod-sp'),
      $('span.f_price'),
      $('#price_section span.jm-heading-xs .jm-ml-xxs'),
      $('.text-2xl')
      
      
    
    );
    console.log({currentPrice})
    const originalPrice = extractPrice(
      $('#priceblock_ourprice'),
      $('.a-price.a-text-price span.a-offscreen'),
      $('#listPrice'),
      $('#priceblock_dealprice'),
      $('.a-size-base.a-color-price'),
      $('.pdpCutPrice'),
      $('#old-price'),
      $('div.prod-price-sec'),
      $('#sec_list_price_'),
      $("strike#price"),
      $('.line-through.text-gray-400.font-medium')
     // $('div.jm-body-s.jm-fc-primary-grey-80,span.line-through')
      
    );
    console.log(originalPrice)
    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
  

    const currency = extractCurrency($('.a-price-symbol'))
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

    const description = extractDescription($)
    //console.log(description);
    
   
    //console.log(description)
    // Construct data object with scraped information
    
      var isNotJson: boolean = false;
      var isString: string = "";
      const images = 
        $('#imgBlkFront').attr('data-a-dynamic-image') || 
        $('#landingImage').attr('data-a-dynamic-image') ||
        $('.cloudzoom').attr('src') ||
        $('#0prod_img').attr("src")||
        $('.slick-slide').attr("src")||
        $('#zoom_picture_gall').attr('src')||
        $('.largeimage').attr('src')||
        
        '{}'
      //console.log(images)
      try{
  
        var json_img = JSON.parse(images);
      }
      catch{
        json_img = images;
      }
  
      if (typeof json_img === "object") {
        //console.log("NOT DICT")
        var imageUrl = Object.keys(json_img);
        isString = imageUrl[0];
      } else {
        //console.log("NOT DICT")
        isString = images
        
      }
      const data = {
      url,
      currency: currency || '$',
      image:isString,
      // image: "{'https://n2.sdlcdn.com/imgs/k/o/v/Portronics-Muffs-M2-Type-C-SDL221794145-1-025d7.jpg'}",
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) ,
      priceHistory: [],
      discountRate: Number(discountRate),
      category: 'category',
      // reviewsCount:100,
      // stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) ,
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }

    return data;
  }catch(error: any) {
    console.log(error);
  }
}