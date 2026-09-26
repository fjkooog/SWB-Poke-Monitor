require('dotenv').config();

const keywords = (process.env.SEARCH_KEYWORDS || 'pokemon trading card game,pokemon tcg,pokemon cards,pokemon trading cards,pokemon card game,pokemon booster,pokemon tcg booster,pokemon booster pack,pokemon booster bundle,pokemon booster box,pokemon elite trainer box,pokemon etb,pokemon collection box,pokemon collection,pokemon premium collection,pokemon special collection,pokemon ex box,pokemon tin,pokemon mini tin,pokemon pokeball tin,pokemon poke ball tin,pokemon blister,pokemon checklane blister,pokemon sleeved booster,pokemon hanger pack,pokemon single pack,pokemon multipack,pokemon multi pack,pokemon 3 pack,pokemon three pack,pokemon 2 pack,pokemon two pack,pokemon 4 pack,pokemon four pack,pokemon 6 pack,pokemon six pack,pokemon battle deck,pokemon theme deck,pokemon ex battle deck,pokemon deluxe battle deck,pokemon league battle deck,pokemon trainer toolkit,pokemon build and battle,pokemon build & battle,pokemon build and battle stadium,pokemon battle academy,pokemon poster collection,pokemon binder collection,pokemon sticker collection,pokemon tech sticker collection,pokemon surprise box,pokemon chest,pokemon collector chest,pokemon lunch box,pokemon advent calendar,pokemon holiday calendar,pokemon premium tournament collection,pokemon ultra premium collection,pokemon ultra-premium collection,pokemon upc,pokemon pokemon center elite trainer box,pokemon pokemon center etb,pokemon illustration collection,pokemon figure collection,pokemon pin collection,pokemon eraser blister,pokemon portfolio,pokemon card portfolio,pokemon card set,pokemon tcg set,pokemon mega evolution')
  .split(',').map(k => k.trim()).filter(Boolean);

const filterKeywords = (process.env.FILTER_KEYWORDS || 'booster,booster pack,booster bundle,booster box,sleeved booster,hanger pack,elite trainer,elite trainer box,etb,pokemon center etb,collection,collection box,premium collection,special collection,illustration collection,poster collection,binder collection,sticker collection,tech sticker collection,figure collection,pin collection,tin,mini tin,pokeball,poke ball,poke ball tin,blister,checklane,checklane blister,3 pack,three pack,2 pack,two pack,4 pack,four pack,6 pack,six pack,multipack,multi pack,bundle,box,pack,ex box,battle deck,theme deck,ex battle deck,deluxe battle deck,league battle deck,trainer toolkit,trainers toolkit,build and battle,build & battle,build and battle stadium,battle academy,collector chest,chest,lunch box,advent calendar,holiday calendar,premium tournament collection,ultra premium collection,ultra-premium collection,upc,eraser blister,portfolio,card portfolio')
  .split(',').map(k => k.trim().toLowerCase()).filter(Boolean);

module.exports = {
  notify: {
    // Which channels to route notifications through.
    // Valid values: 'discord', 'email'  (comma-separated)
    // Each channel also requires its own credentials to be set (see below).
    channels: (process.env.NOTIFY_CHANNELS || 'discord,email')
      .split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
  },

  discord: {
    webhookUrl:          process.env.DISCORD_WEBHOOK_URL          || '',
    communityWebhookUrl: process.env.DISCORD_COMMUNITY_WEBHOOK_URL || '',
    mention:             process.env.DISCORD_MENTION              || '',
  },

  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    from: process.env.EMAIL_FROM || '',
    to: process.env.EMAIL_TO || '',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
  },

  retailers: {
    target: {
      enabled: process.env.TARGET_ENABLED !== 'false',
      name: 'Target',
      color: 0xcc0000,
      keywords,
    },
    walmart: {
      enabled: process.env.WALMART_ENABLED !== 'false',
      name: 'Walmart',
      color: 0x0071ce,
      keywords,
    },
    bestbuy: {
      enabled: process.env.BESTBUY_ENABLED !== 'false',
      name: 'Best Buy',
      color: 0xffe000,
      apiKey: process.env.BESTBUY_API_KEY || '',
      keywords,
    },
    amazon: {
      enabled:    process.env.AMAZON_ENABLED !== 'false',
      name:       'Amazon',
      color:      0xff9900,
      accessKey:  process.env.AMAZON_ACCESS_KEY  || '',
      secretKey:  process.env.AMAZON_SECRET_KEY  || '',
      partnerTag: process.env.AMAZON_PARTNER_TAG || '',
      // true  → include 3rd-party FBA/Prime-eligible sellers
      // false → only items sold directly by Amazon.com (default; safer for MSRP)
      fbaOnly:    process.env.AMAZON_FBA_ONLY === 'true',
    },
    gamestop: {
      // Disabled by default: GameStop uses Cloudflare Enterprise which blocks server-side
      // HTTP requests (GitHub Actions, VPS, etc.). Enable only if you have a residential
      // proxy configured or are running monitor.js locally from a home IP.
      enabled: process.env.GAMESTOP_ENABLED === 'true',
      name:    'GameStop',
      color:   0xe31837,
      keywords,
    },
    barnesandnoble: {
      enabled: process.env.BN_ENABLED !== 'false',
      name:    'Barnes & Noble',
      color:   0x1d6b3d,
      keywords,
    },
    pokemoncenter: {
      enabled:         process.env.PC_ENABLED !== 'false',
      name:            'Pokemon Center',
      color:           0xff0000,
      // Session cookie copied from a real browser (required for product scraping;
      // queue detection works without it). Set PC_COOKIE env var.
      cookie:          process.env.PC_COOKIE || '',
      // Comma-separated product URLs to watch for queue redirects.
      watchUrls:       (process.env.PC_WATCH_URLS || '').split(',').map(u => u.trim()).filter(Boolean),
      // Queue-it customer IDs to probe (the subdomain before .queue-it.net).
      queueitIds:      (process.env.PC_QUEUEIT_IDS || 'pokemoncenter,pokemon,tpci').split(',').map(s => s.trim()).filter(Boolean),
      // When true, Discord queue alert includes @here mention.
      mentionEveryone: process.env.PC_QUEUE_MENTION_EVERYONE === 'true',
    },
  },

  reddit: {
    enabled:    process.env.REDDIT_ENABLED !== 'false',
    subreddits: (process.env.REDDIT_SUBREDDITS || 'PokemonTCG,PokeInvesting')
      .split(',').map(s => s.trim()).filter(Boolean),
  },

  discordListener: {
    enabled: process.env.LISTENER_ENABLED === 'true',
    port:    parseInt(process.env.LISTENER_PORT || '3001', 10),
    secret:  process.env.LISTENER_SECRET || '',
  },

  filterKeywords,
  maxPages: parseInt(process.env.MAX_PAGES || '3', 10),
  dataFile: './data/products.json',
  checkInterval: '*/15 * * * *',

  requestHeaders: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
  },
};
