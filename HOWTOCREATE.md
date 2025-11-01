
```bash
#create nuxt3 application
npx nuxi@latest init .
```

```bash
#run application 
npn run dev
```

```bash
#install tailwindcss 
npm install -D @nuxtjs/tailwindcss
```

```node
#Add Tailwind to nuxt.config.ts: 
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
})

```


```bash
#Create Tailwind configuration file:
npx tailwindcss init
```