# location-logga - DEPRECATED / NO LONGER MAINTAINED


## Summary

It was a good run. Turns out we ended up not using this as much after the 2nd/3rd year. 
I moved back to Los Angeles and become a big fat egg.
Starting 2022, I paid over 12-13$ a month for this, with the price steadily going up. 
This month is the last month I will pay for this - it racked up 16$.
In total, I'd say my bill for this ended up being around ~350$, all said and done.
The site will be left up and running, but it'll be going off of very stale data at this point.

I have
- Deleted my cloud functions. I still have the source code, but GCP has moved onto v2 functions now. V1 is pretty much obselete.
- Deleted my Postgres DB. It was a good run. I find it hilarious that I can't delete a stopped DB. I hurt mysef.
- Killed any cloud scheduler things. I shuddered at how bad this was, but hey, it WORKED!
- Persist my artifacts created in 2025, so the site still has something to read. No new updates.

What I learned:
- You can do start/stop instances, but you'll hate yourself when you come back.
- Storage is cheap. I had initially thought my rising costs were due to the legacy files I was storing. Nope. 
- Running a DB, even if not very long, is not cheap. I originally did the start/stop functions trick with this to at least keep costs 1/100th of what it would have been to keep it running daily.
- Calling the maps API is also not cheap. (I'm surprised at how much it cost me)


## Planned v1 architecture (no longer applicable):

- Cloud function 1 - fetch map data
  A) fetch API key from env
  B) calls the (google maps) API for a given location segment
  C) makes a connect to DB to INSERT the segment


- Cloud scheduler to call cloud function 1 on an interval
- PostGres DB to store data from cloud function
- Cloud function 2 - fetch reporting data through /GET for various segments 
  A) connect to DB to fetch data
  B) return all segments


  


