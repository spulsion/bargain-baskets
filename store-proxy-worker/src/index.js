/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
	  const corsHeaders = {
		"Access-Control-Allow-Origin": "*", // Allow all for now (for development) dont remember 
		"Access-Control-Allow-Methods": "POST, OPTIONS", // but had to do with accessing the info IDK check back later
		"Access-Control-Allow-Headers": "Content-Type",
	  };
  
	  // Handle preflight OPTIONS request (browser sends it before POST sometimes)
	  if (request.method === "OPTIONS") {
		return new Response(null, {
		  status: 204,
		  headers: corsHeaders,
		});
	  }
  
	  if (request.method !== "POST") {
		return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
	  }
  
	  try {
		const { lat, lon } = await request.json();
  
		const radius = 5000;
		const type = "supermarket"; //queries the api for businesses with tag "supermarket"
  
		const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${env.GOOGLE_API_KEY}`;
  
		const googleResponse = await fetch(googleUrl);
		const data = await googleResponse.json();
  
		return new Response(JSON.stringify(data), {
		  headers: {
			...corsHeaders,
			"Content-Type": "application/json",
		  },
		});
  
	  } catch (error) {
		console.error("Worker error:", error);
		return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
	  }
	},
  };
  