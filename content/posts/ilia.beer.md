---
title: Building ilia.beer, A "Buy Me a Beer" Platform
date: 2025-11-27
description: I bought ilia.beer on the train home because the domain made me laugh. A few weeks later it was running from a Raspberry Pi and people could actually use it to buy me beer.
keywords: ilia.beer, Ilia Mirzaali, rmxzy, PHP, Next.js, Google Cloud Transcoder, Raspberry Pi, video compression, web development
author: Ilia Mirzaali
tags:
  - "PHP"
  - "Next.js"
  - "Google Cloud"
  - "Video Processing"
  - "Web Development"
thumbnail: /images/ilia-beer-cover-v3.png
accent: "#d47a2c"
categories:
  - Engineering
---

On the train ride back from the [**BAPC**](https://2025.bapc.eu/) on November 25th, my friends and I were joking about funny domain names we’ve seen. Between all the ridiculous suggestions, the **“.beer”** TLD stood out the most. So, naturally, I did the only reasonable thing that came to my mind: I bought **ilia.beer** on the spot, just in case I’d find something funny to do with it later.

A couple of weeks passed, and somehow that impulsive domain purchase turned into a _“Buy Me a Beer”_ platform. People can now buy me a beer, and I upload a video of me drinking it and cheering to them. And while free beers are great, I actually enjoyed building the technical side of it way more, from handling uploads and compression to optimizing playback.

In this post, I’ll walk you through how this little project came to life and the decisions behind it. Who knows, maybe you’ll end up building your own “Buy Me a [insert alcoholoic drink]” site :)

# Getting the specifics down

To get started with planning the whole project, I first had to pin down the exact features I wanted the website to have. I ended up splitting everything into three main parts:

- **Handling payments**
- **Fast and high-quality video uploads**
- **Fast video downloads and a smooth viewing experience**

Some of these turned out to be much harder than others, but in the end everything came together nicely.

Around this time, I had just bought a Raspberry Pi and wanted to try hosting a couple of small apps on it. This seemed like the perfect chance to run the backend entirely on the Pi. Since the backend for this project was quite small and straightforward, it felt like a good opportunity to see how well the Pi performs when running a web app 24/7.

![Architecture Network Diagram](/images/network.png)

Because this was a hobby project and I wanted to get the most out of it, I decided to build the backend using a language I had never touched before: **PHP**. For the frontend, I went with **Next.js**, mostly because I had some experience with it and it’s incredibly easy to deploy on Vercel.

## Handling payments and headaches

If I had to name this section, I’d call it _“Where I Lost Most of My Life Expectancy.”_

My initial plan was to use the Stripe API. I had seen it used in similar projects, and I didn’t think much of it. So I spent several hours learning the Stripe API and implementing it in pure PHP.

This was… painful.

Half the struggle was figuring out PHP itself, and the other half was trying to make sure my payment flow was actually secure in a language I barely understood.

Eventually, I had a minimal backend running with just the payment endpoints. At this point, I probably _should_ have set up Stripe properly and tested whether any of this even worked. But instead, I jumped straight into building the frontend payment flow. I wanted the experience to be as seamless as possible, so I added the payment widget right on the main page.

After polishing everything up, I finally opened the Stripe dashboard to create my account… and was immediately greeted by a big yellow banner telling me that **residents of the Netherlands are required to have a VAT number**.

To get that VAT number, I’d need to officially register as a business.

At that point, I dropped the Stripe idea entirely and started looking for a simpler solution. I ended up using **BuyMeACoffee**, which already handles small payments and only required me to create an account and copy my payment link. I made a simple SVG button for it, and within 30 minutes the payment system was done.

Sure, this method adds a couple more steps to the payment flow and takes users off my site. But honestly? It was the best option available.

## Uploading videos

Since the entire backend was running on a Raspberry Pi at home, I had to be smart about how video uploads were handled. Uploading a video _first_ to the Pi and _then_ from the Pi to a cloud bucket (like Google Cloud Storage) would have taken ages — my Pi was sitting behind a pretty slow home internet connection.

After some research, I came across **signed URLs**. These basically let the frontend upload a file **directly** to my GCS bucket without the Pi ever touching the video. The backend’s only job is to generate a one-time secure URL. This saves bandwidth, avoids double-uploads, and prevents the Pi from melting every time someone tries to send a 50MB video.

Here’s the code I used for generating that signed URL:

```php
$fileName = uniqid() . '.' . $fileExtension;
$gcsUrl = 'https://storage.googleapis.com/ilia_beer/' . $fileName;

$signedUrl = $this->bucket->object($fileName)->signedUrl(
    new \DateTime('+10 minutes'),
    [
        'method' => 'PUT',
        'contentType' => $contentType,
    ]
);

```

This creates a signed URL that’s valid for 10 minutes, which the frontend can then PUT the video file to directly. On the Next.js side, this was surprisingly simple, it’s basically just a `fetch(signedUrl, { method: "PUT", body: file })`.

Of course, I also needed a place to store the metadata for each video. For that, I set up a simple MySQL table:

```sql
id INT AUTO_INCREMENT PRIMARY KEY,
caption VARCHAR(255),
url TEXT NOT  NULL,
created_at TIMESTAMP  DEFAULT  CURRENT_TIMESTAMP`
```

This was more than enough for what I needed.

One funny challenge I hit was CORS. For about 20 minutes, I thought my signed URLs were broken when in reality Google Cloud simply didn’t like my CORS settings. This was also hard to figure out as google cloud bucket was not returning any useful errors about how this might be the issue. After a while of searching reddit i found that a number of people also had the same issue so after modifying the allowed headers in my google cloud console everything seemed to work perfectly.

## But wait, the videos are too slow to download...

Once I had video uploads working and a simple frontend that listed them all, I immediately noticed the elephant in the room. Because videos were being uploaded in full quality straight to the bucket, they were _huge_. And huge videos meant slow downloads, slow viewing, and just an overall sluggish experience.

Technically, for a “Buy Me a Beer” website, this shouldn’t have mattered that much. But the whole fun of the website is literally watching the beer videos, and if that part is slow, the site loses its charm. So I needed a way to compress videos _somewhere_ along the pipeline.

The three options I tried were:

- **Client-side compression using FFMPEG.wasm**
- **Local compression on the Pi using FFMPEG**
- **Google Transcoder API**

And after a lot of trial, error, and swearing, I ended up going with the Google Transcoder API. But it’s worth going through the dead ends too.

---

### Client-side compression using FFMPEG.wasm

This was the first thing I tried, it came up in the first Google search, and I thought:  
**-“If I compress on the client, users just wait a bit longer during upload, and the rest is painless.”**

Yeah… no.

After a LOT of testing and different configurations, the fastest I managed to get was around **700 KB/s**, which is painfully slow when your average video is 100 MB+. It also makes sense: browsers simply aren’t built for heavy video processing, and FFMPEG.wasm is basically FFMPEG duct-taped into WebAssembly.

It was cool to learn how compression works in the browser, but it just wasn’t practical. So I scrapped the idea.

---

### Local compression using FFMPEG

Next idea:  
**“If the browser is slow, maybe the Pi can handle it.”**

And it _could_! The Pi was surprisingly fast at compressing videos.  
But here’s where I realized my stupidity:

To compress the video on the Pi, I would first need to **download** the entire file from GCS back to the Pi… only to compress it… and then **upload it again**.

Way too many steps, completely defeats the purpose of signed URLs, and would absolutely wreck the Pi’s network connection. Dropped this idea too.

---

### Google Transcoder API

Finally, after some more Googling, I discovered that Google offers a **Transcoder API** that can compress videos _directly_ inside the cloud bucket. This meant no involvement by me after I first uploaded the video which was perfect.

The only tricky part was figuring out how to update the video URL once transcoding finished.  
If this was a Node.js or Python backend, I would’ve just set up a webhook that triggers automatically when a job finishes. But PHP’s ecosystem made that more annoying.

Here’s the method I used to create the transcoding job:

```php
$videoId = $body['videoId'];
$video = $this->videoGateway->GetById($videoId);

$outputUrl = 'https://storage.googleapis.com/ilia_beer/transcoded/' . basename($video['url']);

$job = $this->transcoder->CreateJob($this->parent, [
    'inputUri' => $video['url'],
    'outputUri' => $outputUrl,
    'templateId' => 'preset/web-hd'
]);
```

Since I couldn’t rely on webhooks easily, I went with a simple periodic job checker. Every 15 minutes:

1.  Look up each transcoding job by its job name
2.  If it’s done → update the database to point to the compressed video and mark it as _finished_
3.  If it’s still running → wait another 15 minutes
4.  If it takes too long → mark it as _failed_

To make this work, I also stored:

- the job name
- the video status (`uploaded`, `transcoding`, `finished`, `failed`)

This setup actually worked really well and kept everything running smoothly without the Pi doing any heavy work.

## Putting everything together

Once the backend was up and running (and after a couple hours of wrestling with raw PHP routes, controllers, and all that good stuff), the last big piece was figuring out how to actually _load_ the videos on the frontend.

Since the videos on the site are displayed one after another in a vertical feed, it didn’t really make sense to download everything at once. So instead, I made the videos download **sequentially**: first video downloads, once it’s ready, the next one starts, and so on.  
This way, by the time the user finishes watching the first video, the next one is already sitting there fully downloaded and ready to go. Smooth scrolling, no buffering.

Here’s the little bit of React magic that starts the next download as soon as the current one finishes:

```js
const startDownloadingNextVideo = useCallback(() => {
  const currentIndex = nextVideoToDownload.current;

  // No more videos left
  if (currentIndex >= videos.length) return;

  const video = videoRefs.current[currentIndex];
  if (!video) return;

  // Skip if already downloading or already loaded
  if (downloadingVideos.current.has(currentIndex) || video.readyState >= 3) {
    nextVideoToDownload.current = currentIndex + 1;
    startDownloadingNextVideoRef.current?.();
    return;
  }

  // Start downloading this video
  downloadingVideos.current.add(currentIndex);
  video.preload = "auto";
  video.load();
}, [videos.length]);
```

After that… I just vibecoded.  
Tweaked some front-end styling, polished up the UI a bit, slapped everything into Docker so deploying to the Pi is easier, and boom, the whole thing was basically done.

So the final product was: **[ilia.beer](https://ilia.beer)**

If you want to check out the full project or build your own version, the entire thing is up on GitHub:

👉 **[https://github.com/ramzxy/ilia.beer](https://github.com/ramzxy/ilia.beer)**

Hope you enjoyed the blog. Happy hacking, and see you in the next one.
