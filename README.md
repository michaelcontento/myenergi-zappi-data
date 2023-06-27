# myenergy-data

This repository contains (in the `data/` folder) the raw data of my [Zappi][] wallbox retreived from the official MyEnergi API. 

I do this, as the API of MyEnergi is very slow, sometimes unstable and I'm also a bit a data hoarder :joy:

A GitHub Action will auto-import new files every morning and (currently) we store the most granular data available (one datapoint per minute).

## File format / API schema

As there is no official API documentation we have to use informations gathered by the community. For this please head over to [MyEnergi-App-Api].

But for archival purpose (maybe the MyEnergi-App-Api repo get removed sometime), here the infos for the files we store:

```json
{
  "min": 1,       // Minute
  "dow": "Sat",   // Day of week
  "dom": 8,       // Day of month
  "mon": 6,       // Month
  "yr": 2019,     // Year
  "imp": 42900,   // Imported Joules this minute; divide by 60 get average Watts; divide by 3600000 to get kWh
  "exp": 260220,  // Exported Joules
  "gen": 180,     // ???
  "gep": 1560,    // Generated Joules
  "h1d": 600,     // Phase 1 used Joules for charging
  "h2d": 1260,    // Phase 2 used Joules for charging
  "h3d": 720,     // Phase 3 used Joules for charging
  "v1": 2446,     // Voltage
  "frq": 5006,    // Frequency
  "nect1": 42900
}
```

  [Zappi]: https://www.myenergi.com/de/zappi/
  [MyEnergi-App-Api]: https://github.com/twonk/MyEnergi-App-Api
