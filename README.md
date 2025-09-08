Features -
- Microservice based
- Integrated telemetry (Otel, loki, promethus, jeagerUI, grafana)
- Jwt auth implemented from scratch with register user, login user, and refresh token functionality
- passwords are base64 encoded
- communication between servers is done via gRPC protocol, optimizing communication by 400%
<!-- - video/audio is streamd to cliend via http live streaming (HLS) thus reducing load time -->
- All services are dockerised and can easily set up and run via docker
- User can upload, delete songs, edit bio, chat with other users, see what song other users are listening to
- UI is dynamic and components are dragable like in spotify webUI
- State management using zustand
<!-- - Tests implemented using jest -->
<!-- - using webpack and bable for js optimization -->
- Infinte scroll ... in the queue list of songs user will get more songs as they scroll down
- smooth UI animations making immersive ux.
- statistical data for admin user
- linux styled git commit for better developer usablility
- Integrated user chat functionality where users can chat and see what their friends are listening to
- Ambient shader for albums background based on album cover
<!-- - Global Search in frontend with `command + k` which has `lazyload` functionality so that app doesn't get blocked -->
<!-- - create a link to invite/add friend to your friend list -->
---
Internals -
- auth-db is running on port 27017
- service-db is running on port 27020
- frontend is written is typescript
- microservices in backend - 
    - auth 
    - service ( This handles serving songs to the users)
    - chat ( Handles chat between users and helps users see what their friends are listening to)
    - admin ( This service is used to upload songs to database)


# Musit – A Microservice-based Music Streaming Platform
### Features
- Microservice Architecture – Scalable, modular backend.
- Integrated Telemetry – Observability with OpenTelemetry, Loki, Prometheus, Jaeger UI & Grafana.
- Optimized Streaming – Audio served via streams, reducing memory usage by 300% (300 MB → 3 MB).
- Client playback powered by HTTP Live Streaming (HLS).
- Preloads next track for zero-lag experience.
- Custom JWT auth (register, login, refresh tokens).
- Passwords base64 encoded.
- High-performance Communication – Services talk over gRPC, reducing latency by 400%.
### User Features
- Upload / delete songs 🎶
- Edit bio ✍️
- Upload new songs
- Chat with friends 💬
- Infinite scroll in queue list 🔄
- See what others are listening to 👀
- View detailed statistical insights 📊
- preloads next song for better user experience
- Smooth resizable UI components (like Spotify Web UI).

### Dev Features –
- View detailed statistical insights with telemetry
- Fully Containerized – Run everything with Docker.
- Testing – Automated tests with Jest.

### Internals
#### Databases:
- `auth-db` → `Port::27017`
- `service-db` → `Port::27020`
- `chat-db` → `Port::27030`

####  Frontend: `TypeScript (React)`.

#### Backend Microservices:
- `auth` → Handles authentication & JWT. `Javascript`
    - dependencies -> `Expressjs` `gRPC`
- `service` → Serves songs & streaming logic. `Javascript`
    - dependencies -> `Mutler` `Expressjs` `gRPC`
- `chat` → User chat + friend activity. `Golang`
    - dependencies -> GorillaWebsocket 
<!-- - `admin` → Upload & manage songs. `Javascript` -->



## How to use it :

### set up ->
Startup servers - 
```bash
cd backend/server && npm install && npm start
cd backend/auth && npm install && npm start
cd frontend && npm install && npm start
```
Startup databases - 
```zsh
docker compose up
```

<!-- 
#### TODO Learning for me - 
- what is populate, push, pull, aggregate function in mongodb?
- how does ref works in mongodb?
- how exactly does gRPC works? also learn its internals 
- Learn how these event listeners work -> audio.addEventListener("timeupdate", updateTime) && audio.removeEventListener("loadedmetadata", updateDuration)
-->