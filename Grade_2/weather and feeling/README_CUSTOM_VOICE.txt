FEELINGS & WEATHER — CUSTOM VOICE READY

Audio architecture:
- 40 spoken items
- one cached MP3 audio sprite instead of 40 individual WAV requests
- browser speechSynthesis fallback removed (no surprise computer voice)
- Web Audio playback from decoded memory after the first load

IMPORTANT:
The included sprite currently contains the interaction's EXISTING voice as a placeholder.
To make it truly your own voice, record the 40 lines in CUSTOM_VOICE_RECORDING_SCRIPT.txt and provide that recording.
The previous Family & Pets recordings cannot produce these new Feelings/Weather phrases.

100-user optimization:
- all PNG visuals converted to WebP at the same pixel dimensions
- runtime service-worker caching
- only the small shell/audio is precached; images cache as they are used
